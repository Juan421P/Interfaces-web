import { ROUTES } from './../../js/helpers/routes.js';
import { stripScripts } from './../../js/helpers/common-methods.js';

export class Modal {
    static instances = new Map();

    constructor(opts = {}) {
        this.id = opts.id || 'default-modal';

        if (Modal.instances.has(this.id)) {
            return Modal.instances.get(this.id);
        }
        Modal.instances.set(this.id, this);

        this.url = opts.url || ROUTES.components.modal.html;
        this.size = opts.size || 'md';
        this.content = opts.content;
        this.templateId = opts.templateId;
        this.renderMode = opts.renderMode || 'template';
        this.overlay = null;
        this.container = null;
        this.contentHost = null;
        this.closeBtn = null;
        this.hideCloseButton = !!opts.hideCloseButton;

        this.components = Array.isArray(opts.components) ? opts.components : [];

        this._open();
    }

    _sizeClasses() {
        return { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
    }

    _applySize() {
        if (!this.container) return;
        const cls = this._sizeClasses();
        Object.values(cls).forEach(c => this.container.classList.remove(c));
        this.container.classList.add(cls[this.size] ?? cls.md);
    }

    _setContent() {
        if (!this.contentHost) return;
        this.contentHost.innerHTML = '';

        if (this.renderMode === 'template') {
            if (this.templateId) {
                const tpl = document.getElementById(this.templateId);
                if (tpl) this.contentHost.appendChild(tpl.content.cloneNode(true));
                else console.warn(`[Modal] templateId "${this.templateId}" not found`);
            } else if (typeof this.content === 'string') {
                this.contentHost.innerHTML = this.content;
            } else if (this.content instanceof HTMLElement) {
                this.contentHost.appendChild(this.content);
            } else {
            }
        } else if (this.renderMode === 'component') {
            if (this.content instanceof HTMLElement) {
                this.contentHost.appendChild(this.content);
            } else if (this.content && this.content.root instanceof HTMLElement) {
                this.contentHost.appendChild(this.content.root);
            } else if (Array.isArray(this.content)) {
            } else {
            }
        } else {
            console.warn(`[Modal] Unknown renderMode: ${this.renderMode}`);
        }
    }

    async _load() {
        if (this.overlay) return;

        const markup = await (await fetch(this.url + '?raw')).text();
        const tpl = stripScripts(markup);

        document.body.appendChild(tpl.content.cloneNode(true));

        this.overlay = document.getElementById('modal-overlay');
        this.container = document.getElementById('modal-container');
        this.contentHost = document.getElementById('modal-content');
        this.closeBtn = document.getElementById('modal-close');

        if (!this.overlay || !this.container || !this.contentHost) {
            console.error('[Modal] Modal template is missing required elements (overlay/container/content).');
            return;
        }

        if (!this.hideCloseButton && this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        } else if (this.closeBtn) {
            this.closeBtn.classList.add('hidden');
        }

        this.overlay.addEventListener('click', e => {
            if (e.target === this.overlay) this.close();
        });

        this._applySize();
    }

    async _open() {
        if (!this.overlay) await this._load();

        this._setContent();

        requestAnimationFrame(() => {
            this.overlay.classList.remove('opacity-0', 'pointer-events-none');
            this.overlay.classList.add('opacity-100');
            this.container.classList.remove('scale-90', 'opacity-0');
            this.container.classList.add('scale-100', 'opacity-100');

            this._initComponents();
        });
    }

    _initComponents() {
        const list = [];

        if (Array.isArray(this.components)) list.push(...this.components);
        if (this.renderMode === 'component' && Array.isArray(this.content)) list.push(...this.content);

        for (const comp of list) {
            if (!comp || typeof comp.type !== 'function') continue;

            const opts = Object.assign({}, comp.opts || {});

            if (typeof opts.host === 'string') {
                try {
                    const hostElInside = this.rootQuery(opts.host);
                    if (hostElInside) opts.host = hostElInside;
                } catch (err) {
                }
            }

            try {
                new comp.type(opts);
            } catch (err) {
                console.error('[Modal] Failed to init component', comp, err);
            }
        }
    }

    rootQuery(selector) {
        try {
            if (this.contentHost) {
                const el = this.contentHost.querySelector(selector);
                if (el) return el;
            }
            if (this.container) {
                const el = this.container.querySelector(selector);
                if (el) return el;
            }
            return document.querySelector(selector);
        } catch (err) {
            return document.querySelector(selector);
        }
    }

    close() {
        if (!this.overlay) return;

        this.overlay.classList.remove('opacity-100');
        this.overlay.classList.add('opacity-0', 'pointer-events-none');

        const done = (e) => {
            if (e && e.target !== this.overlay) return;
            this.overlay.removeEventListener('transitionend', done);

            try { this.overlay.remove(); } catch (_) { /* ignore */ }

            this.overlay = null;
            this.container = null;
            this.contentHost = null;
            this.closeBtn = null;

            Modal.instances.delete(this.id);
        };

        const hasTransition = getComputedStyle(this.overlay).transitionDuration !== '0s';
        if (hasTransition) {
            this.overlay.addEventListener('transitionend', done);
        } else {
            done();
        }
    }
}
