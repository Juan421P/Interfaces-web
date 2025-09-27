import { ROUTES } from '../../../js/lib/routes.js';
import { stripScripts } from '../../../js/lib/common.js';

const { ContextMenu } = await import(ROUTES.components.contextMenu.js);
const { Toast } = await import(ROUTES.components.toast.js);
const toast = await new Toast();
toast.init();

export class CardContainer {
    constructor(opts = {}) {
        this.host = opts.host;
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
        this.url = opts.url || ROUTES.components.cardContainer.html;

        if (!this.service || typeof this.service.list !== 'function') {
            throw new Error('[CardContainer] requires a service with .list()');
        }
        if (this.paginated && !this.perPage) {
            throw new Error('[CardContainer] paginated containers require perPage.');
        }

        this.page = 1;
        this.sort = { index: -1, dir: 1 };
        this.contextMenu = new ContextMenu();

        this._bindServiceEvents();
        this._render();
    }

    _bindServiceEvents() {
        const prefix = this.servicePrefix || this.service?.contract?.name || this.service?.name || 'Service';

        const reload = () => {
            if (this.service?.list) {
                this.service.list();
            }
        };

        document.addEventListener(`${prefix}:create`, reload);
        document.addEventListener(`${prefix}:update`, reload);
        document.addEventListener(`${prefix}:delete`, reload);
    }

    async _render() {
        try {
            const raw = await (await fetch(this.url + '?raw')).text();
            const tpl = stripScripts(raw);

            this.root = tpl.content.firstElementChild.cloneNode(true);
            this.$list = this.root.querySelector('[data-card-list]');
            this.$pagination = this.root.querySelector('[data-pagination]');
            this.$searchHost = this.root.querySelector('[data-search]');

            const hostEl = (typeof this.host === 'string') ? document.querySelector(this.host) : this.host;
            if (!hostEl) throw new Error('[CardContainer] host element not found');
            hostEl.innerHTML = '';
            hostEl.appendChild(this.root);

            if (this.searchable && this.$searchHost) {
                const { SearchInput } = await import(ROUTES.components.searchInput.js);
                this.searchInput = new SearchInput({
                    host: this.$searchHost,
                    placeholder: 'Buscar',
                    onSearch: (val) => this._renderCards(val)
                });
            }

            this.data = await this.service.list();
            this._renderCards();

        } catch (err) {
            console.error('[CardContainer] render failed', err);
        }
    }

    _paginate(array) {
        if (!this.paginated) return array;
        const start = (this.page - 1) * this.perPage;
        return array.slice(start, start + this.perPage);
    }

    _renderCards(filterStr = '') {
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
            this.data = await this.service.list();
            console.log(this.data);
            const filter = this.searchInput?.getValue?.() || '';
            this._renderCards(filter);
        } catch (err) {
            console.error('[CardContainer] reload failed', err);
        }
    }

    _renderPagination(total) {
        if (!this.paginated) {
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
