import { Component } from './../../components.js';
import { ComponentInitializationError } from './../../../js/errors/components/lifecycle/component-initialization-error.js';

export class Form extends Component {

    static getTemplate() {
        return '';
    }

    constructor(opts = {}) {
        if (!opts.host) throw new Error('Form requires a host element');

        const host = typeof opts.host === 'string' ? document.querySelector(opts.host) : opts.host;

        if (!host) {
            throw new ComponentInitializationError(
                'Form',
                opts.host,
                new Error('Form host element not found')
            );
        }

        super({
            host: host
        });

        this.formClass = opts.formClass || '';
        this.sections = opts.sections || [];
        this.onSubmit = opts.onSubmit || null;
        this.formElement = null;
        this.components = [];

        this.opts = opts;
    }

    async _render() {
        try {
            this._generateFormStructure();

            await this._renderSections();

            if (this.onSubmit) {
                this.formElement.addEventListener('submit', this._handleSubmit.bind(this));
            }

            this.host.innerHTML = '';
            this.host.appendChild(this.formElement);

        } catch (error) {
            console.error('Form _render failed:', error);
            this._renderFallback();
        }
    }

    _generateFormStructure() {
        this.formElement = document.createElement('form');
        this.formElement.className = this.formClass;
        this.formElement.setAttribute('novalidate', 'true');

        this.sectionsContainer = document.createElement('div');
        this.formElement.appendChild(this.sectionsContainer);
    }

    async _renderSections() {
        for (const section of this.sections) {
            await this._renderSection(section);
        }
    }

    async _renderSection(section) {
        const sectionElement = document.createElement('div');

        if (section.opts) {
            this._applySectionStyles(sectionElement, section.opts);
        }

        if (section.titles) {
            this._renderTitles(sectionElement, section.titles);
        }

        if (section.components) {
            await this._renderComponents(sectionElement, section.components);
        }

        this.sectionsContainer.appendChild(sectionElement);
    }

    _applySectionStyles(sectionElement, opts) {
        if (opts.gap) {
            sectionElement.style.gap = `${opts.gap * 0.25}rem`;
        }
        if (opts.px) {
            sectionElement.style.paddingLeft = `${opts.px * 0.25}rem`;
            sectionElement.style.paddingRight = `${opts.px * 0.25}rem`;
        }
        if (opts.py) {
            sectionElement.style.paddingTop = `${opts.py * 0.25}rem`;
            sectionElement.style.paddingBottom = `${opts.py * 0.25}rem`;
        }

        sectionElement.style.display = 'flex';
        sectionElement.style.flexDirection = 'column';
    }

    _renderTitles(container, titles) {
        titles.forEach(title => {
            const titleElement = document.createElement(title.relevance === 1 ? 'h1' :
                title.relevance === 2 ? 'h2' : 'h3');
            titleElement.textContent = title.text;
            titleElement.className = title.classes?.join(' ') || '';
            container.appendChild(titleElement);
        });
    }

    async _renderComponents(container, components) {
        for (const compConfig of components) {
            await this._renderComponent(container, compConfig);
        }
    }

    async _renderComponent(container, compConfig) {
        const componentHost = document.createElement('div');
        container.appendChild(componentHost);

        try {
            const component = new compConfig.type({
                host: componentHost,
                ...compConfig.opts
            });

            await component.render();
            this.components.push(component);

        } catch (error) {
            console.error(`Failed to render component:`, error);
            componentHost.innerHTML = `<div class="component-error">Component failed to load</div>`;
        }
    }

    _handleSubmit(event) {
        event.preventDefault();

        if (this.onSubmit) {
            const values = this._getFormValues();
            this.onSubmit(values);
        }
    }

    _getFormValues() {
        const values = {};

        const inputs = this.formElement.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.id) {
                values[input.id] = input.value;
            }
        });

        this.components.forEach(component => {
            if (component.getValue && component.opts?.id) {
                values[component.opts.id] = component.getValue();
            }
        });

        return values;
    }

    getValues() {
        return this._getFormValues();
    }

    setValues(values) {
        Object.keys(values).forEach(key => {
            const input = this.formElement.querySelector(`#${key}`);
            if (input) {
                input.value = values[key];
            }
        });
    }

    reset() {
        this.formElement.reset();
    }

    validate() {
        return this.formElement.checkValidity();
    }

    destroy() {
        this.components.forEach(component => {
            if (typeof component.destroy === 'function') {
                component.destroy();
            }
        });
        this.components = [];

        super.destroy();
    }
}