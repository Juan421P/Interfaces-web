import { ROUTES } from './../../js/helpers/routes.js';
import { stripScripts } from './../../js/helpers/common-methods.js';

export class ContextMenu {
    constructor(opts = {}) {
        this.url = opts.url || ROUTES.components.contextMenu.html;
        this.actions = opts.actions || [];
        this.menu = null;
        this.isOpen = false;
        this._ignoreNextClick = false;

        this._handleOutsideClick = this._handleOutsideClick.bind(this);
    }

    async load() {
        if (this.menu) return;
        const markup = await (await fetch(this.url + '?raw')).text();
        const tpl = stripScripts(markup);

        const templateEl = tpl.content ? tpl : document.createElement('template');
        if (!tpl.content) templateEl.innerHTML = tpl;

        const cloned = templateEl.content.querySelector('#tmpl-context-menu').content.cloneNode(true);
        document.body.appendChild(cloned);

        this.menu = document.getElementById('context-menu');
    }

    async open(x, y, actions = []) {
        await this.load();
        this.close();

        this.menu.innerHTML = '';

        actions.forEach(action => {
            const btn = document.createElement('button');
            btn.textContent = action.label;
            btn.className =
                `block w-full text-left px-3 py-1 rounded transition-colors ${action.className || ''}`;
            if (action.disabled) {
                btn.disabled = true;
                btn.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                btn.addEventListener('click', () => {
                    this.close();
                    action.onClick?.();
                });
            }
            this.menu.appendChild(btn);
        });

        this.menu.style.top = `${y}px`;
        this.menu.style.left = `${x}px`;

        this.menu.classList.remove('hidden');
        this.isOpen = true;

        this._ignoreNextClick = true;
        document.addEventListener('click', this._handleOutsideClick, true);
    }

    close() {
        if (!this.menu) return;
        this.menu.classList.add('hidden');
        this.isOpen = false;
        document.removeEventListener('click', this._handleOutsideClick, true);
    }

    _handleOutsideClick(e) {
        if (this._ignoreNextClick) {
            this._ignoreNextClick = false;
            return;
        }
        if (!this.menu.contains(e.target)) {
            this.close();
        }
    }
}