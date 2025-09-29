import { stripScripts } from './../../js/lib/common.js';
import { ComponentError } from '../../js/errors/components/base/component-error.js';
import { ComponentRenderError } from '../../js/errors/components/base/component-render-error.js';
import { ComponentTemplateError } from '../../js/errors/components/base/component-template-error.js';
import { ComponentInitializationError } from '../../js/errors/components/lifecycle/component-initialization-error.js';

export class Component {

    constructor(opts = {}) {
        try {
            if (!opts.host) {
                throw new ComponentError(this.constructor.name, 'Component requires a host element');
            }

            this.host = typeof opts.host === 'string' ? document.querySelector(opts.host) : opts.host;

            if (!this.host) {
                throw new ComponentInitializationError(
                    this.constructor.name,
                    opts.host,
                    new Error(`Element not found in DOM`)
                );
            }

            this.id = opts.id || `comp-${Math.random().toString(36).substr(2, 9)}`;
            this.classes = opts.classes || [];
            this.template = this.constructor.getTemplate ? this.constructor.getTemplate() : '';
            this.isRendered = false;

        } catch (error) {
            if (error instanceof ComponentError) {
                throw error;
            }
            throw new ComponentError(this.constructor.name, 'Construction failed', { originalError: error.message });
        }
    }

    _processTemplate() {
        if (!this.template) return this._getFallbackTemplate();

        try {
            const processedTemplate = stripScripts(this.template);

            if (!processedTemplate.content.firstElementChild) {
                throw new ComponentTemplateError(
                    this.constructor.name,
                    'inline template',
                    'Template is empty or invalid'
                );
            }

            return processedTemplate;

        } catch (error) {
            if (error instanceof ComponentTemplateError) {
                throw error;
            }
            throw new ComponentTemplateError(
                this.constructor.name,
                'inline template',
                `Failed to process template: ${error.message}`
            );
        }
    }

    async render() {
        try {
            await this._beforeRender();
            await this._render();
            this.isRendered = true;
            await this._afterRender();

        } catch (error) {
            if (error instanceof ComponentRenderError) {
                throw error;
            }
            throw new ComponentRenderError(
                this.constructor.name,
                'main render phase',
                error
            );
        }
    }

    async _render() {
        throw new ComponentError(
            this.constructor.name,
            '_render() method must be implemented by subclass'
        );
    }

    async _beforeRender() {
    }

    async _afterRender() {
    }

    _renderFallback() {
        this.host.innerHTML = `<div class="component-error">${this.constructor.name} failed to render</div>`;
    }

    destroy() {
        this.host.innerHTML = '';
        this.host.classList.remove('component-host');
        this.isRendered = false;
    }

    static events = new EventTarget();

    static emit(event, detail) {
        this.events.dispatchEvent(new CustomEvent(event, { detail }));
    }

    static on(event, callback) {
        this.events.addEventListener(event, callback);
    }

    static off(event, callback) {
        this.events.removeEventListener(event, callback);
    }
    
}