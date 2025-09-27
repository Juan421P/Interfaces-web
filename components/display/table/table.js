import { ROUTES } from '../../../js/lib/routes.js';
import { stripScripts } from '../../../js/lib/common.js';

const { ContextMenu } = await import(ROUTES.components.contextMenu.js);
const { Toast } = await import(ROUTES.components.toast.js);
const toast = await new Toast();
toast.init();

export class Table {
    constructor(opts = {}) {
        this.host = opts.host;
        this.headers = opts.headers || [];
        this.service = opts.service;
        this.servicePrefix = opts.servicePrefix || [];

        this.useContextMenu = !!opts.contextMenu;
        this.contextMenuOpts = opts.contextMenuOpts || null;

        this.sortable = !!opts.sortable;
        this.searchable = !!opts.searchable;
        this.paginated = !!opts.paginated;
        this.perPage = opts.perPage ?? null;
        this.searchFields = opts.searchFields ?? null;
        this.url = opts.url || ROUTES.components.table.html;

        if (!this.service || typeof this.service.list !== 'function') {
            throw new Error('[Table] requires a service with .list()');
        }
        if (this.paginated && !this.perPage) {
            throw new Error('[Table] paginated tables require perPage.');
        }
        if (!this.paginated && this.perPage) {
            throw new Error('[Table] perPage only allowed if paginated = true.');
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

        // document.addEventListener(`${prefix}:list`, reload);
        document.addEventListener(`${prefix}:create`, reload);
        document.addEventListener(`${prefix}:update`, reload);
        document.addEventListener(`${prefix}:delete`, reload);
    }

    async _render() {
        try {
            const raw = await (await fetch(this.url + '?raw')).text();
            const tpl = stripScripts(raw);

            this.root = tpl.content.firstElementChild.cloneNode(true);
            this.$table = this.root.querySelector('[data-table]');
            this.$thead = this.root.querySelector('thead');
            this.$tbody = this.root.querySelector('tbody');
            this.$pagination = this.root.querySelector('[data-pagination]');
            this.$searchHost = this.root.querySelector('[data-search]');
            this.$filtersHost = this.root.querySelector('[data-filters]');

            const hostEl = (typeof this.host === 'string') ? document.querySelector(this.host) : this.host;
            if (!hostEl) throw new Error('[Table] host element not found');
            hostEl.innerHTML = '';
            hostEl.appendChild(this.root);

            if (this.searchable && this.$searchHost) {
                const { SearchInput } = await import(ROUTES.components.searchInput.js);
                this.searchInput = new SearchInput({
                    host: this.$searchHost,
                    placeholder: 'Buscar',
                    onSearch: (val) => this._renderBody(val)
                });
            }

            this._renderHeaders();
            this._bindHeaderEvents();

            this.data = await this.service.list();
            this._renderBody();

        } catch (err) {
            console.error('[Table] render failed', err);
        }
    }

    _renderHeaders() {
        if (!this.headers.length) {
            this.$thead.innerHTML = '';
            return;
        }

        this.$thead.innerHTML = `
          <tr>
            ${this.headers.map((h, i) => {
            const label = typeof h === "object" ? h.label : h;
            return `
                  <th data-col="${i}" class="px-4 py-3 text-left select-none ${this.sortable ? 'cursor-pointer' : ''}">
                    <div class="flex bg-gradient-to-r from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] bg-clip-text text-transparent drop-shadow">
                      ${label} ${this.sortable ? '<span class="sort-indicator hidden ml-2">▲</span>' : ''}
                    </div>
                  </th>
                `;
        }).join('')}
          </tr>`;
    }

    _bindHeaderEvents() {
        if (!this.sortable) return;
        this.$thead.querySelectorAll('th').forEach(th => {
            th.addEventListener('click', () => {
                const idx = Number(th.dataset.col);
                if (this.sort.index === idx) this.sort.dir *= -1;
                else this.sort = { index: idx, dir: 1 };
                const filter = this.searchInput?.getValue?.() || '';
                this._renderBody(filter);
            });
        });
    }

    _paginate(array) {
        if (!this.paginated) return array;
        const start = (this.page - 1) * this.perPage;
        return array.slice(start, start + this.perPage);
    }

    _renderBody(filterStr = '') {
        let data = Array.isArray(this.data) ? this.data.slice() : [];

        if (filterStr) {
            const fields = this.searchFields ?? this.headers.map((_, i) => i);
            data = data.filter(row => {
                const cells = Array.isArray(row)
                    ? row
                    : this.headers.map((h, i) => {
                        const key = typeof h === "object" ? h.key : h;
                        return row[key] ?? row[i] ?? '';
                    });
                return fields.some(fIdx => {
                    const idx = (typeof fIdx === 'number')
                        ? fIdx
                        : this.headers.findIndex(h => (typeof h === "object" ? h.key : h) === String(fIdx));
                    const val = String(cells[idx] ?? '').toLowerCase();
                    return val.includes(filterStr.toLowerCase());
                });
            });
        }

        if (this.sortable && this.sort.index >= 0) {
            const { index, dir } = this.sort;
            data = data.slice().sort((a, b) => {
                const key = typeof this.headers[index] === "object" ? this.headers[index].key : this.headers[index];
                const av = String(Array.isArray(a) ? a[index] : a[key] ?? '').toLowerCase();
                const bv = String(Array.isArray(b) ? b[index] : b[key] ?? '').toLowerCase();
                return av === bv ? 0 : (av > bv ? dir : -dir);
            });
        }

        const totalPages = this.paginated ? Math.max(1, Math.ceil(data.length / this.perPage)) : 1;
        if (this.paginated) this.page = Math.min(this.page, totalPages);
        const pageRows = this._paginate(data);

        this.$tbody.innerHTML = pageRows.length ? pageRows.map(row => {
            const cells = Array.isArray(row)
                ? row
                : this.headers.map((h, i) => {
                    const key = typeof h === "object" ? h.key : h;
                    return row[key] ?? row[i] ?? '';
                });
            return `<tr class="group hover:bg-gradient-to-r hover:from-[rgb(var(--button-from))] hover:to-[rgb(var(--button-to))] transition-colors cursor-pointer duration-150">
                ${cells.map(cell => `
                    <td class="px-4 py-3 whitespace-nowrap text-left">
                        <div class="bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow group-hover:text-[rgb(var(--button-text))]">
                            ${cell}
                        </div>
                    </td>`).join('')}
            </tr>`;
        }).join('') : `<tr><td class="px-4 py-3 text-center" colspan="${Math.max(1, this.headers.length)}">Sin datos</td></tr>`;

        if (this.useContextMenu && this.contextMenuOpts) {
            this.$tbody.querySelectorAll('tr').forEach((tr, idx) => {
                tr.addEventListener('click', async (e) => {
                    const rowData = pageRows[idx];
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

        if (this.sortable) {
            this.$thead.querySelectorAll('th').forEach(th => {
                const ind = th.querySelector('.sort-indicator');
                if (!ind) return;
                if (Number(th.dataset.col) === this.sort.index) {
                    ind.classList.remove('hidden');
                    ind.textContent = this.sort.dir === 1 ? '▲' : '▼';
                } else ind.classList.add('hidden');
            });
        }

        this._renderPagination(totalPages);
    }

    async reload() {
        try {
            this.data = await this.service.list();
            const filter = this.searchInput?.getValue?.() || '';
            this._renderBody(filter);
        } catch (err) {
            console.error('[Table] reload failed', err);
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
                this._renderBody(filter);
            });
        });
    }
}
