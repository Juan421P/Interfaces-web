import { Component } from './../../base/component.js';

export class TabBar extends Component {
  /**
   * @param {Object} opts
   * @param {string|HTMLElement} opts.host
   * @param {Array<{id:string,label:string,onClick?:Function,targetSelector?:string}>} opts.tabs
   * @param {string} [opts.activeId]
   * @param {string} [opts.activeClass]
   */
  constructor(opts = {}) {
    // ✅ validación de host (patrón consistente con otros)
    if (!opts.host) throw new Error('[TabBar] TabBar requires a host element');
    const host = typeof opts.host === 'string' ? document.querySelector(opts.host) : opts.host;
    if (!host) throw new Error('[TabBar] host element not found');

    // this.url = opts.url || ROUTES.components.tabBar.html; // ❌ deprecado (comentado)
    super({ host }); // ✅ ahora hereda de Component

    this.tabs = opts.tabs || [];
    if (!this.tabs.length) throw new Error('[TabBar] tabs array is required');

    this.activeId = opts.activeId || this.tabs[0].id;
    this.activeClass = opts.activeClass || 'bg-[rgb(var(--card-from))]';

    // render inmediato (igual que Button/Checkbox)
    this._render();
  }

  // ✅ HTML embebido (tu plantilla)
  static getTemplate() {
    return `
<template id="tmpl-tabbar">
  <div class="flex flex-wrap gap-3" data-tab-bar>
    <button data-tab=""
      class="px-4 py-2 font-medium rounded-lg select-none code-tab-btn hover:bg-[rgb(var(--card-from))] drop-shadow transition-all duration-300 cursor-pointer hover:scale-105">
      <span
        class="bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] text-transparent bg-clip-text">
      </span>
    </button>
  </div>
</template>
    `;
  }

  async _render() {
    try {
      // ✅ montar desde template embebido (sin fetch)
      const t = document.createElement('template');
      t.innerHTML = TabBar.getTemplate();
      const tmpl = t.content.querySelector('#tmpl-tabbar');

      // this.root = contenedor de la barra
      this.root = tmpl.content.firstElementChild.cloneNode(true);

      // base button para clonar
      const baseBtn = this.root.querySelector('button');
      baseBtn.remove();

      // construir tabs
      this.tabs.forEach(tab => {
        const btn = baseBtn.cloneNode(true);
        btn.dataset.tab = tab.id;
        btn.querySelector('span').textContent = tab.label;

        btn.addEventListener('click', () => this._activateTab(tab));

        if (tab.id === this.activeId) btn.classList.add(this.activeClass);
        this.root.appendChild(btn);
      });

      // montar en host
      this.host.innerHTML = '';
      this.host.appendChild(this.root);

      // activar por defecto
      const defaultTab = this.tabs.find(t => t.id === this.activeId);
      if (defaultTab) this._activateTab(defaultTab, true);

    } catch (error) {
      console.error('[TabBar] render failed :(', error);
    }
  }

  _activateTab(tab, skipClick = false) {
    // limitar búsqueda a esta instancia
    this.root.querySelectorAll('[data-tab]').forEach(b => b.classList.remove(this.activeClass));

    const btn = this.root.querySelector(`[data-tab="${tab.id}"]`);
    if (btn) btn.classList.add(this.activeClass);

    // mostrar/ocultar targets externos si se configuraron
    if (tab.targetSelector) {
      this.tabs.forEach(t => {
        if (!t.targetSelector) return;
        const el = document.querySelector(t.targetSelector);
        if (el) el.classList.toggle('hidden', t.id !== tab.id);
      });
    }

    if (!skipClick && typeof tab.onClick === 'function') {
      tab.onClick(tab.id);
    }
  }
}
