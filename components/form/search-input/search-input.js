import { FormComponent } from '../../base/form-component.js';

export class SearchInput extends FormComponent {
  // ✅ plantilla embebida (tu HTML tal cual, envuelto en <template>)
  static getTemplate() {
    return `
<template id="tmpl-search-input">
  <div class="w-full sm:max-w-xs sm:w-auto" data-search-root>
    <input type="text" placeholder="Buscar" class="w-full bg-gradient-to-r from-[rgb(var(--card-from))] to-[rgb(var(--card-to))] 
           px-4 py-3 rounded-lg focus:outline-none 
           text-[rgb(var(--text-from))] placeholder:text-[rgb(var(--placeholder-from))] 
           placeholder:italic text-shadow shadow-md border-none select-none focus:ring-0" data-search-input />
  </div>
</template>
    `;
  }

  constructor(opts = {}) {
    if (!opts.host) throw new Error('[SearchInput] requires a host element');
    const hostEl = typeof opts.host === 'string' ? document.querySelector(opts.host) : opts.host;
    if (!hostEl) throw new Error('[SearchInput] host element not found');

    // Si tu FormComponent requiere props en super, pásalas aquí.
    super({ host: hostEl });

    this.host = hostEl;
    this.placeholder = opts.placeholder || 'Buscar';
    this.onSearch = typeof opts.onSearch === 'function' ? opts.onSearch : () => {};
    this.root = null;
    this.$input = null;

    this._render();
  }

  async _render() {
    try {
      // ❌ Antes: fetch(ROUTES.components.searchInput.html) + stripScripts
      // ✅ Ahora: usar la plantilla embebida
      const t = document.createElement('template');
      t.innerHTML = SearchInput.getTemplate();
      const tmpl = t.content.querySelector('#tmpl-search-input');

      this.root = tmpl.content.firstElementChild.cloneNode(true);
      this.$input = this.root.querySelector('[data-search-input]');
      if (!this.$input) throw new Error('[SearchInput] template must contain [data-search-input]');

      this.$input.placeholder = this.placeholder;
      this.$input.addEventListener('input', (e) => {
        const val = (e.target.value || '').trim().toLowerCase();
        try { this.onSearch(val); } catch (err) { console.error('[SearchInput] onSearch threw', err); }
      });

      this.host.innerHTML = '';
      this.host.appendChild(this.root);
    } catch (err) {
      console.error('[SearchInput] render failed', err);
    }
  }

  getValue() {
    return (this.$input?.value || '').trim().toLowerCase();
  }

  clear() {
    if (!this.$input) return;
    this.$input.value = '';
    try { this.onSearch(''); } catch { /* ignore */ }
  }
}
