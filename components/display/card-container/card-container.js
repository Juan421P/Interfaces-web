import { DisplayComponent } from './../../base/display-component.js';
import { ComponentRenderError } from './../../../js/errors/components/base/component-render-error.js';
import { ContextMenu } from '../../overlay/context-menu/context-menu.js';
import { Toast } from '../../overlay/toast/toast.js';
import { SearchInput } from '../../form/search-input/search-input.js';   

export class CardContainer extends DisplayComponent {

  static getTemplate() {
    return `
<template id="tmpl-card-container">
  <div class="w-full h-full overflow-y-auto select-none" data-card-root>
    <div class="flex flex-wrap gap-3 mb-4" data-search></div>
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3" data-card-list></div>
    <div data-pagination class="flex items-center justify-end hidden gap-2 mt-4 text-xs"></div>
  </div>
</template>
    `;
  }

  constructor(opts = {}) {
    if (!opts.host) throw new Error('[CardContainer] requires a host element');
    if (!opts.service) throw new Error('[CardContainer] requires a service');

    super(opts);

    this.host = typeof opts.host === 'string' ? document.querySelector(opts.host) : opts.host;
    this.fields = opts.fields || [];
    this.service = opts.service;
    this.servicePrefix = opts.servicePrefix || [];

    this.useContextMenu = !!opts.contextMenu;
    this.contextMenuOpts = opts.contextMenuOpts || null;

    this.sortable = !!opts.sortable;
    this.searchable = !!opts.searchable;
    this.paginated = !!opts.paginated;
    this.perPage = opts.perPage ?? null;
    this.searchFields = opts.searchFields ?? null;

    // this.url = opts.url || ROUTES.components.display.cardContainer.html; // ❌ deprecado

    if (this.paginated && !this.perPage) {
      throw new Error('[CardContainer] paginated containers require perPage.');
    }

    this.page = 1;
    this.sort = { index: -1, dir: 1 };

    this._bindServiceEvents();
  }

  async _beforeRender() {
    // ❌ antes: dynamic import vía ROUTES
    // const { ContextMenu } = await import(ROUTES.components.overlay.contextMenu.js);
    // const { Toast } = await import(ROUTES.components.overlay.toast.js);

    // ✅ ahora usamos los imports directos de arriba
    this.contextMenu = new ContextMenu();
    this.toast = new Toast();
    await this.toast.init();
  }

  _bindServiceEvents() {
    const prefix = this.servicePrefix || this.service?.contract?.name || this.service?.name || 'Service';

    const reload = () => { if (this.service?.list) this.service.list(); };

    document.addEventListener(`${prefix}:create`, reload);
    document.addEventListener(`${prefix}:update`, reload);
    document.addEventListener(`${prefix}:delete`, reload);
  }

  async _render() {
    try {
      // ❌ antes: fetch + stripScripts
      // const raw = await (await fetch(this.url + '?raw')).text();
      // const tpl = stripScripts(raw);
      // this.root = tpl.content.firstElementChild.cloneNode(true);

      // ✅ ahora: montar desde template embebido
      const t = document.createElement('template');
      t.innerHTML = CardContainer.getTemplate();
      const tmpl = t.content.querySelector('#tmpl-card-container');

      this.root = tmpl.content.firstElementChild.cloneNode(true);
      this.$list = this.root.querySelector('[data-card-list]');
      this.$pagination = this.root.querySelector('[data-pagination]');
      this.$searchHost = this.root.querySelector('[data-search]');

      if (!this.host) throw new Error('[CardContainer] host element not found');
      this.host.innerHTML = '';
      this.host.appendChild(this.root);

      if (this.searchable && this.$searchHost) {
        // ❌ antes: import(ROUTES.components.searchInput.js)
        // ✅ ahora: clase importada arriba
        this.searchInput = new SearchInput({
          host: this.$searchHost,
          placeholder: 'Buscar',
          onSearch: (val) => this._renderCards(val)
        });
      }

    } catch (err) {
      throw new ComponentRenderError('CardContainer', 'template rendering', err);
    }
  }

  async _onDataLoaded() {
    const filter = this.searchInput?.getValue?.() || '';
    this._renderCards(filter);
  }

  _paginate(array) {
    if (!this.paginated) return array;
    const start = (this.page - 1) * this.perPage;
    return array.slice(start, start + this.perPage);
  }

  _renderCards(filterStr = '') {
    if (!this.$list) return;

    let data = Array.isArray(this.data) ? this.data.slice() : [];

    if (filterStr) {
      const fields = this.searchFields ?? this.fields.map((_, i) => i);
      data = data.filter(entry => {
        return fields.some(fIdx => {
          const key = typeof fIdx === 'string' ? fIdx : this.fields[fIdx];
          const val = String(entry[key] ?? '').toLowerCase();
          return val.includes(filterStr.toLowerCase());
        });
      });
    }

    if (this.sortable && this.sort.index >= 0) {
      const { index, dir } = this.sort;
      const key = this.fields[index];
      data = data.slice().sort((a, b) => {
        const av = String(a[key] ?? '').toLowerCase();
        const bv = String(b[key] ?? '').toLowerCase();
        return av === bv ? 0 : (av > bv ? dir : -dir);
      });
    }

    const totalPages = this.paginated ? Math.max(1, Math.ceil(data.length / this.perPage)) : 1;
    if (this.paginated) this.page = Math.min(this.page, totalPages);
    const pageData = this._paginate(data);

    this.$list.innerHTML = pageData.length
      ? pageData.map(entry => this._renderCard(entry)).join('')
      : `<div class="p-4 text-center col-span-full">Sin datos</div>`;

    if (this.useContextMenu && this.contextMenuOpts) {
      this.$list.querySelectorAll('[data-card]').forEach((cardEl, idx) => {
        cardEl.addEventListener('click', async (e) => {
          const rowData = pageData[idx];
          let items = this.contextMenuOpts;

          if (typeof this.contextMenuOpts === 'function') {
            items = this.contextMenuOpts(rowData);
          }

          if (Array.isArray(items) && items.length) {
            await this.contextMenu.open(e.clientX, e.clientY, items);
          }
        });
      });
    }

    this._renderPagination(totalPages);
  }

  _renderCard(entry) {
    const content = this.fields.map(f => {
      const val = entry[f] ?? '';
      return `<div class="text-sm"><span class="font-medium">${f}:</span> ${val}</div>`;
    }).join('');

    return `
      <div data-card class="p-4 rounded-xl shadow-md bg-white hover:bg-gradient-to-r hover:from-[rgb(var(--button-from))] hover:to-[rgb(var(--button-to))] transition cursor-pointer">
        ${content}
      </div>
    `;
  }

  async reload() {
    try {
      await this.loadData();
      const filter = this.searchInput?.getValue?.() || '';
      this._renderCards(filter);
    } catch (err) {
      console.error('[CardContainer] reload failed', err);
    }
  }

  _renderPagination(total) {
    if (!this.paginated || !this.$pagination) {
      if (this.$pagination) this.$pagination.classList.add('hidden');
      return;
    }
    this.$pagination.classList.remove('hidden');

    const btn = (label, page, disabled = false) => (
      `<button ${disabled ? 'disabled' : ''} data-page="${page}"
        class="px-2 py-1 ${disabled ? 'text-[rgb(var(--button-from))] cursor-not-allowed' : 'cursor-pointer'}">${label}</button>`
    );

    this.$pagination.innerHTML = `
      ${btn('‹', this.page - 1, this.page === 1)}
      <span class="mx-2 font-medium text-[rgb(var(--button-from))]">${this.page}/${total}</span>
      ${btn('›', this.page + 1, this.page === total)}
    `;

    this.$pagination.querySelectorAll('button[data-page]').forEach(b => {
      b.addEventListener('click', () => {
        this.page = Number(b.dataset.page);
        const filter = this.searchInput?.getValue?.() || '';
        this._renderCards(filter);
      });
    });
  }
}
