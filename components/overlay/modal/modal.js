import { Component } from './../../base/component.js';

export class Modal extends Component {

  static instances = new Map();

  // ✅ Template embebido
  static getTemplate() {
    return `
<template id="tmpl-modal">
  <div id="modal-overlay"
       class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center
              opacity-0 pointer-events-none transition-opacity duration-300 z-[999] scrollbar-width-none">
      <div id="modal-container"
           class="relative w-full max-w-lg transition-all duration-300 scale-90 opacity-0">
          <div class="bg-gradient-to-bl from-[rgb(var(--off-from))] to-[rgb(var(--off-from))] p-[2px] rounded-2xl">
              <div id="modal-content" class="bg-gradient-to-bl from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] rounded-2xl"></div>
          </div>
          <button id="modal-close"
                  class="absolute w-6 h-6 text-[rgb(var(--off-from))] transition-colors duration-300 cursor-pointer top-5 right-5 hover:text-[rgb(var(--placeholder-from))] drop-shadow">
              <svg class="w-6 h-6" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
          </button>
      </div>
  </div>
</template>`;
  }

  constructor(opts = {}) {
    super({
      host: document.body,
      // url: opts.url || ROUTES.components.overlay.modal.html,   // ❌
      autoRender: false
    });

    this.id = opts.id || 'default-modal';

    if (Modal.instances.has(this.id)) {
      return Modal.instances.get(this.id);
    }
    Modal.instances.set(this.id, this);

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
      }
    } else if (this.renderMode === 'component') {
      if (this.content instanceof HTMLElement) {
        this.contentHost.appendChild(this.content);
      } else if (this.content && this.content.root instanceof HTMLElement) {
        this.contentHost.appendChild(this.content.root);
      }
    } else {
      console.warn(`[Modal] Unknown renderMode: ${this.renderMode}`);
    }
  }

  async _load() {
    if (this.overlay) return;

    // ❌ Antes: fetch(this.url) + stripScripts
    // ✅ Ahora: clonar desde template embebido (una sola vez)
    const t = document.createElement('template');
    t.innerHTML = Modal.getTemplate();

    if (!document.getElementById('tmpl-modal')) {
      document.body.appendChild(t.content.cloneNode(true));
    }

    // Inyectar una instancia del modal al DOM
    const tpl = document.getElementById('tmpl-modal');
    const fragment = tpl.content.cloneNode(true);
    document.body.appendChild(fragment);

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
      let hostEl = null;

      if (opts.host && typeof opts.host === 'string' && opts.host.startsWith('#')) {
        hostEl = this.rootQuery(opts.host);
        if (!hostEl && this.contentHost) {
          hostEl = document.createElement('div');
          hostEl.id = opts.host.slice(1);
          this.contentHost.appendChild(hostEl);
        }
      }

      if (!opts.host) {
        opts.host = this.contentHost;
      } else {
        opts.host = hostEl || this.rootQuery(opts.host) || this.contentHost;
      }

      if ('templateId' in opts && !opts.templateId) {
        delete opts.templateId;
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
      if (!selector) return this.contentHost;
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

      try { this.overlay.remove(); } catch (_) { /* noop */ }

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

  async render() {}
  async _render() {}
}
