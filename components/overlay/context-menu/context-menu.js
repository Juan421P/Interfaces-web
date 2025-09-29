import { Component } from './../../base/component.js';

export class ContextMenu extends Component {
  // ✅ HTML embebido
  static getTemplate() {
    return `
<template id="tmpl-context-menu">
  <div id="context-menu" class="absolute z-50 hidden p-2 text-sm bg-white rounded-lg shadow-md select-none"></div>
</template>`;
  }

  constructor(opts = {}) {
    super({
      host: document.body,
      // url: opts.url || ROUTES.components.overlay.contextMenu.html, // ❌
      autoRender: false
    });

    this.actions = opts.actions || [];
    this.menu = null;
    this.isOpen = false;

    this._handleOutsideClick = this._handleOutsideClick.bind(this);

    this.load();
  }

  async load() {
    if (this.menu) return;

    // ❌ Antes: fetch(this.url) + stripScripts
    // ✅ Ahora: clonar desde template embebido
    const t = document.createElement('template');
    t.innerHTML = ContextMenu.getTemplate();

    // Evita duplicar el template en el DOM si ya existe
    if (!document.getElementById('tmpl-context-menu')) {
      document.body.appendChild(t.content.cloneNode(true));
    }

    // Clona el contenido del template y lo agrega al body si no existe el menú
    if (!document.getElementById('context-menu')) {
      const tpl = document.getElementById('tmpl-context-menu');
      const cloned = tpl.content.cloneNode(true);
      document.body.appendChild(cloned);
    }

    this.menu = document.getElementById('context-menu');
    this.menu.classList.add('hidden');
  }

  async open(x, y, actions = [], pos = 'br') {
    if (!['br', 'tr', 'bl', 'tl'].includes(pos)) pos = 'br';

    await this.load();
    this.close();

    this.menu.innerHTML = '';

    actions.forEach(action => {
      const btn = document.createElement('button');
      btn.textContent = action.label;
      btn.className = `block cursor-pointer w-full text-left px-3 py-1 rounded transition-colors hover:bg-[rgb(var(--card-from))] hover:text-[rgb(var(--text-from))] ${action.className || ''}`;
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

    this.menu.classList.remove('hidden');

    // reset posicionamiento
    this.menu.style.top = '';
    this.menu.style.left = '';
    this.menu.style.bottom = '';
    this.menu.style.right = '';

    switch (pos) {
      case 'br':
        this.menu.style.top = `${y}px`;
        this.menu.style.left = `${x}px`;
        break;
      case 'tr':
        this.menu.style.bottom = `${window.innerHeight - y}px`;
        this.menu.style.left = `${x}px`;
        break;
      case 'bl':
        this.menu.style.top = `${y}px`;
        this.menu.style.right = `${window.innerWidth - x}px`;
        break;
      case 'tl':
        this.menu.style.bottom = `${window.innerHeight - y}px`;
        this.menu.style.right = `${window.innerWidth - x}px`;
        break;
    }

    // Evitar overflow en viewport
    const rect = this.menu.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      this.menu.style.left = `${window.innerWidth - rect.width}px`;
      this.menu.style.right = '';
    }
    if (rect.bottom > window.innerHeight) {
      this.menu.style.top = `${window.innerHeight - rect.height}px`;
      this.menu.style.bottom = '';
    }
    if (rect.left < 0) {
      this.menu.style.left = '0px';
      this.menu.style.right = '';
    }
    if (rect.top < 0) {
      this.menu.style.top = '0px';
      this.menu.style.bottom = '';
    }

    this.isOpen = true;
    document.addEventListener('click', this._handleOutsideClick, true);
  }

  close() {
    if (!this.menu) return;
    this.menu.classList.add('hidden');
    this.isOpen = false;
    document.removeEventListener('click', this._handleOutsideClick, true);
  }

  _handleOutsideClick(e) {
    if (!this.menu.contains(e.target)) {
      this.close();
    }
  }

  async render() {}
  async _render() {}

  async destroy() {
    this.close();
    if (this.menu) {
      this.menu.remove();
      this.menu = null;
    }
    await super.destroy();
  }
}
