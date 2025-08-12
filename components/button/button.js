import { ROUTES } from './../../js/helpers/routes.js';
import { stripScripts } from '../../js/helpers/common-methods.js';

export class Button {
    constructor(opts = {}) {
        if (!opts.host) throw new Error('Button requires a host element');

        this.host = typeof opts.host === 'string' ? document.querySelector(opts.host) : opts.host;
        this.text = opts.text || '';
        this.collapseText = opts.collapseText || true;
        this.icon = opts.icon || '';
        this.onClick = opts.onClick || null;
        this.url = opts.url || ROUTES.components.button.html;
        this.buttonType = opts.buttonType || 1;
        this.showIcon = opts.showIcon !== undefined ? opts.showIcon : true;

        if (!this.showIcon) {
            this.collapseText = false;
        } else {
            this.collapseText = opts.collapseText || false;
        }

        if (!this.host) {
            console.error('Button host not found:', opts.host);
            return;
        }

        this._render();
    }

    async _render() {
        try {
            const response = await fetch(this.url + '?raw');
            const html = await response.text();
            const template = stripScripts(html);
            this.root = template.content.firstElementChild.cloneNode(true);

            if (this.buttonType === 1) {
                this.root.classList.add('btn-component');
            } else if (this.buttonType === 2) {
                this.root.classList.add('secondary-btn-component');
            }

            const iconEl = this.root.querySelector('#button-icon');
            const textEl = this.root.querySelector('#button-text');

            if (iconEl) {
                if (this.showIcon) {
                    if (this.icon) {
                        iconEl.outerHTML = this.icon;
                    }
                } else {
                    iconEl.remove();
                }
            }

            if (textEl) {
                if (this.text) {
                    textEl.textContent = this.text;
                    textEl.classList.toggle('hidden', this.collapseText);
                    textEl.classList.toggle('lg:block', this.collapseText);
                } else {
                    textEl.remove();
                }
            }

            if (this.onClick) {
                this.root.addEventListener('click', this.onClick);
            }

            this.host.innerHTML = '';
            this.host.appendChild(this.root);

        } catch (error) {
            console.error('Button _render failed:', error);
            this.host.innerHTML = `
        <button class="bg-blue-500 text-white px-4 py-2 rounded">
          ${this.text || 'Button'}
        </button>
      `;
            if (this.onClick) {
                this.host.firstElementChild.addEventListener('click', this.onClick);
            }
        }
    }

    setText(text) {
        const textEl = this.root?.querySelector('#button-text');
        if (textEl) textEl.textContent = text;
    }

    setIcon(icon) {
        const iconEl = this.root?.querySelector('#button-icon');
        if (iconEl && icon) iconEl.outerHTML = icon;
    }

}