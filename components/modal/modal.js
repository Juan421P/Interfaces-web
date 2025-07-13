import { ROUTES } from './../../js/helpers/routes.js';
import { stripScripts } from './../../js/helpers/common-methods.js';

export class Modal {
    constructor(opts = {}) {
        this.url = opts.url || ROUTES.components.modal.html;
        this.size = opts.size || 'md';
        this.content = opts.content;
        this.templateId = opts.templateId;
        this.overlay = null;
        this.hideCloseButton = opts.hideCloseButton || false;
    }

    _sizeClasses() {
        return { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
    }

    _applySize() {
        const cls = this._sizeClasses();
        Object.values(cls).forEach(c => this.container.classList.remove(c));
        this.container.classList.add(cls[this.size] ?? cls.md);
    }

    _setContent() {
        this.contentHost.innerHTML = '';
        if (this.templateId) {
            const tpl = document.getElementById(this.templateId);
            if (tpl) this.contentHost.appendChild(tpl.content.cloneNode(true));
        } else if (typeof this.content === 'string') {
            this.contentHost.innerHTML = this.content;
        }
    }

    async load() {
        if (this.overlay) return;

        const markup = await (await fetch(this.url + '?raw')).text();
        const tpl = stripScripts(markup);

        document.body.appendChild(tpl.content.cloneNode(true));

        this.overlay = document.getElementById('modal-overlay');
        this.container = document.getElementById('modal-container');
        this.contentHost = document.getElementById('modal-content');
        this.closeBtn = document.getElementById('modal-close');
        if (!this.hideCloseButton) {
            this.closeBtn.addEventListener('click', () => this.close());
        } else {
            this.closeBtn.classList.add('hidden');
        }
        this.overlay.addEventListener('click', e => {
            if (e.target === this.overlay) this.close();
        });

        this._applySize();
    }

    async open() {
        if (!this.overlay) await this.load();
        this._setContent();

        requestAnimationFrame(() => {
            this.overlay.classList.remove('opacity-0', 'pointer-events-none');
            this.overlay.classList.add('opacity-100');
            this.container.classList.remove('scale-90', 'opacity-0');
            this.container.classList.add('scale-100', 'opacity-100');
        });
    }

    close() {
        this.overlay.classList.remove('opacity-100');
        this.overlay.classList.add('opacity-0', 'pointer-events-none');

        const done = () => {
            this.overlay.removeEventListener('transitionend', done);
            this.overlay.remove();
            this.overlay = null;
            this.container = null;
            this.contentHost = null;
        };
        this.overlay.addEventListener('transitionend', done);
    }
}
