import { Component } from './../../base/component.js';
import { ROUTES } from './../../../js/lib/routes.js';
import { ComponentRenderError } from './../../../js/errors/components/base/component-render-error.js';

export class Body extends Component {
    constructor(opts = {}) {
        super({
            host: document.body,
            url: opts.url || ROUTES.components.layout.body.html,
            autoRender: false
        });

        this.content = opts.content || '';
        this.afterLoad = opts.afterLoad || null;
        this.mainSelector = opts.mainSelector || '#main';
        this.originalBodyHTML = document.body.innerHTML;

        this._load();
    }

    async _load() {
        try {
            const res = await fetch(this.url + '?raw');
            if (!res.ok) throw new Error(`Cannot fetch ${this.url} :(`);

            document.body.outerHTML = await res.text();

            if (this.content) {
                const main = document.querySelector(this.mainSelector);
                if (main) main.innerHTML = this.content;
            }

            if (typeof this.afterLoad === 'function') {
                this.afterLoad();
            }
        } catch (error) {
            console.error('Body component failed :(', error);
        }
    }

    async _beforeRender() {
        this.originalBodyClasses = document.body.className;
    }

    async _render() {
        try {
            const template = await this._fetchTemplate();

            if (!template) {
                throw new ComponentRenderError(
                    this.constructor.name,
                    'template fetching',
                    new Error('Failed to load body template')
                );
            }

            document.body.outerHTML = template.content.firstElementChild.outerHTML;

            this.host = document.body;

            if (this.originalBodyClasses) {
                document.body.className += ' ' + this.originalBodyClasses;
            }

            if (this.content) {
                await this._injectContent();
            }

        } catch (error) {
            throw new ComponentRenderError(
                this.constructor.name,
                'body replacement',
                error
            );
        }
    }

    async _afterRender() {
        if (typeof this.afterLoad === 'function') {
            try {
                await this.afterLoad();
            } catch (error) {
                console.error('[Body] afterLoad callback failed:', error);
            }
        }
    }

    async _injectContent() {
        const mainElement = document.querySelector(this.mainSelector);
        if (mainElement) {
            mainElement.innerHTML = this.content;
        } else {
            console.warn(`[Body] Main content area not found with selector: ${this.mainSelector}`);
        }
    }

    async setContent(content, selector = null) {
        this.content = content;
        const targetSelector = selector || this.mainSelector;
        const targetElement = document.querySelector(targetSelector);

        if (targetElement) {
            targetElement.innerHTML = content;
        } else {
            throw new ComponentRenderError(
                this.constructor.name,
                'content injection',
                new Error(`Content area not found: ${targetSelector}`)
            );
        }
    }

    async appendContent(content, selector = null) {
        const targetSelector = selector || this.mainSelector;
        const targetElement = document.querySelector(targetSelector);

        if (targetElement) {
            targetElement.innerHTML += content;
        } else {
            throw new ComponentRenderError(
                this.constructor.name,
                'content appending',
                new Error(`Content area not found: ${targetSelector}`)
            );
        }
    }

    async clearContent(selector = null) {
        const targetSelector = selector || this.mainSelector;
        const targetElement = document.querySelector(targetSelector);

        if (targetElement) {
            targetElement.innerHTML = '';
        }
    }

    async restore() {
        try {
            document.body.outerHTML = this.originalBodyHTML;
            this.host = document.body;
        } catch (error) {
            throw new ComponentRenderError(
                this.constructor.name,
                'body restoration',
                error
            );
        }
    }

    getMainElement() {
        return document.querySelector(this.mainSelector);
    }

    hasMainElement() {
        return !!document.querySelector(this.mainSelector);
    }

    async destroy() {
        await this.restore();
        await super.destroy();
    }

    _getFallbackTemplate() {
        const template = document.createElement('template');
        template.innerHTML = `
            <body>
                <div id="main" class="min-h-screen bg-gray-100">
                    ${this.content || 'Body content failed to load'}
                </div>
            </body>
        `;
        return template;
    }
}