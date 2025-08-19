import { ROUTES } from './../../js/helpers/routes.js';
import { stripScripts } from '../../js/helpers/common-methods.js';

export class Table {
    constructor(opts = {}) {
        this.host = opts.host;
        this.headers = opts.headers || [];
        this.data = Array.isArray(opts.data) ? opts.data : (opts.data ? [opts.data] : []);
        this.sortable = !!opts.sortable;
        this.searchable = !!opts.searchable;
        this.paginated = !!opts.paginated;
        this.perPage = opts.perPage ?? null;
        this.searchFields = opts.searchFields ?? null;
        this.url = opts.url || ROUTES.components.table.html;

        if (this.paginated && !this.perPage) {
            throw new Error('[Table] paginated tables require perPage.');
        }
        if (!this.paginated && this.perPage) {
            throw new Error('[Table] perPage only allowed if paginated = true.');
        }

        this.page = 1;
        this.sort = { index: -1, dir: 1 };

        this.root = null;
        this.$table = null;
        this.$thead = null;
        this.$tbody = null;
        this.$pagination = null;
        this.$searchHost = null;
        this.$filtersHost = null;

        this.searchInput = null;

        this._render();
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
                    onSearch: (val) => this.__renderBody(val)
                });
            }

            this.__renderHeaders();
            this._bindHeaderEvents();
            this.__renderBody('');
        } catch (err) {
            console.error('[Table] render failed', err);
        }
    }

    __renderHeaders() {
        if (!this.headers.length) {
            this.$thead.innerHTML = '';
            return;
        }

        this.$thead.innerHTML = `
      <tr>
        ${this.headers.map((h, i) => `
          <th data-col="${i}" class="px-4 py-3 text-left select-none ${this.sortable ? 'cursor-pointer' : ''}">
            <div class="flex bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow">
              ${h} ${this.sortable ? '<span class="sort-indicator hidden ml-2">▲</span>' : ''}
            </div>
          </th>
        `).join('')}
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
                this.__renderBody(filter);
            });
        });
    }

    _paginate(array) {
        if (!this.paginated) return array;
        const start = (this.page - 1) * this.perPage;
        return array.slice(start, start + this.perPage);
    }

    __renderBody(filterStr = '') {
        let data = Array.isArray(this.data) ? this.data.slice() : [];

        if (filterStr) {
            const fields = this.searchFields ?? this.headers.map((_, i) => i);
            data = data.filter(row => {
                const cells = Array.isArray(row) ? row : this.headers.map((h, i) => row[h] ?? row[i] ?? '');
                return fields.some(fIdx => {
                    const idx = (typeof fIdx === 'number') ? fIdx : this.headers.indexOf(String(fIdx));
                    const val = String(cells[idx] ?? '').toLowerCase();
                    return val.includes(filterStr);
                });
            });
        }

        if (this.sortable && this.sort.index >= 0) {
            const { index, dir } = this.sort;
            data = data.slice().sort((a, b) => {
                const av = String(Array.isArray(a) ? a[index] : a[this.headers[index]] ?? '').toLowerCase();
                const bv = String(Array.isArray(b) ? b[index] : b[this.headers[index]] ?? '').toLowerCase();
                return av === bv ? 0 : (av > bv ? dir : -dir);
            });
        }

        const totalPages = this.paginated ? Math.max(1, Math.ceil(data.length / this.perPage)) : 1;
        if (this.paginated) this.page = Math.min(this.page, totalPages);
        const pageRows = this._paginate(data);

        this.$tbody.innerHTML = pageRows.length ? pageRows.map(row => {
            const cells = Array.isArray(row) ? row : this.headers.map((h, i) => row[h] ?? row[i] ?? '');
            return `<tr class="hover:bg-[rgb(var(--card-from))] transition-colors duration-150">${cells.map(cell => `
        <td class="px-4 py-3 whitespace-nowrap text-left">
          <div class="bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow">
            ${cell}
          </div>
        </td>`).join('')}</tr>`;
        }).join('') : `<tr><td class="px-4 py-3 text-center text-gray-400" colspan="${Math.max(1, this.headers.length)}">Sin datos</td></tr>`;

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

        this.__renderPagination(totalPages);
    }

    __renderPagination(total) {
        if (!this.paginated) {
            if (this.$pagination) this.$pagination.classList.add('hidden');
            return;
        }
        this.$pagination.classList.remove('hidden');

        const btn = (label, page, disabled = false) => (
            `<button ${disabled ? 'disabled' : ''} data-page="${page}"
         class="px-2 py-1 ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}">${label}</button>`
        );

        this.$pagination.innerHTML = `
      ${btn('‹', this.page - 1, this.page === 1)}
      <span class="mx-2 font-medium">${this.page}/${total}</span>
      ${btn('›', this.page + 1, this.page === total)}
    `;

        this.$pagination.querySelectorAll('button[data-page]').forEach(b => {
            b.addEventListener('click', () => {
                this.page = Number(b.dataset.page);
                const filter = this.searchInput?.getValue?.() || '';
                this.__renderBody(filter);
            });
        });
    }
}
