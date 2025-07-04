export class Table {

    /**
     * @param {Object} opts
     * @param {string} opts.host
     * @param {string[]} [opts.headers]
     * @param {Array[]} [opts.rows]
     * @param {boolean} [opts.sortable]
     * @param {boolean} [opts.searchable]
     * @param {boolean} [opts.paginated]
     * @param {number} [opts.perPage]
     * @param {string} [opts.url]
     */
    constructor(opts = {}) {
        Object.assign(this, {
            hostSel: opts.host,
            headers: opts.headers || [],
            rows: opts.rows || [],
            sortable: opts.sortable || false,
            searchable: opts.searchable || false,
            paginated: opts.paginated || false,
            perPage: opts.perPage || 10,
            url: opts.url || './components/table/table.html'
        });
        this.page = 1;
        this.sort = { index: -1, dir: 1 };
    }

    async render() {

        const txt = await (await fetch(this.url + '?raw')).text();
        const tpl = document.createElement('template');
        tpl.innerHTML = txt.trim();
        this.root = tpl.content.firstElementChild;

        this.$thead = this.root.querySelector('thead');
        this.$tbody = this.root.querySelector('tbody');
        this.$searchWrap = this.root.querySelector('[data-search]');
        this.$pagination = this.root.querySelector('[data-pagination]');

        this._renderHeaders();
        this._bindHeaderEvents();
        this._bindSearch();
        this._renderBody();

        const host = document.querySelector(this.hostSel);
        host.innerHTML = '';
        host.appendChild(this.root);
    }

    setRows(rows) {
        this.rows = rows;
        this.page = 1;
        this._renderBody();
    }

    _renderHeaders() {
        if (!this.headers.length) return;
        this.$thead.innerHTML =
            `<tr>${this.headers.map((h, i) => `
        <th class="px-4 py-3 font-semibold tracking-wide ${this.sortable ? 'hover:bg-indigo-200' : ''}"
            data-col="${i}">${h}
          ${this.sortable ? '<span class="ml-1 sort-indicator hidden">▲</span>' : ''}
        </th>`).join('')}
       </tr>`;
    }

    _bindHeaderEvents() {
        if (!this.sortable) return;
        this.$thead.querySelectorAll('th').forEach(th => {
            th.addEventListener('click', () => {
                const idx = +th.dataset.col;
                if (this.sort.index === idx) this.sort.dir *= -1;
                else this.sort = { index: idx, dir: 1 };
                this._renderBody();
            });
        });
    }

    _bindSearch() {
        if (!this.searchable) return;
        this.$searchWrap.classList.remove('hidden');
        const input = this.$searchWrap.querySelector('input');
        input.addEventListener('input', () => {
            this.page = 1;
            this._renderBody(input.value.trim().toLowerCase());
        });
    }

    _paginate(array) {
        if (!this.paginated) return array;
        const start = (this.page - 1) * this.perPage;
        return array.slice(start, start + this.perPage);
    }

    _renderBody(filterStr = '') {
        // Filtrar
        let data = this.rows;
        if (filterStr) {
            data = data.filter(r => r.some(cell => String(cell).toLowerCase().includes(filterStr)));
        }

        // Filtrar
        if (this.sortable && this.sort.index >= 0) {
            const { index, dir } = this.sort;
            data = [...data].sort((a, b) => (a[index] > b[index] ? dir : -dir));
        }
        
        // Información de la paginación
        const totalPages = this.paginated ? Math.max(1, Math.ceil(data.length / this.perPage)) : 1;
        if (this.paginated) this.page = Math.min(this.page, totalPages);

        // Lo de la página actual
        const pageRows = this._paginate(data);

        // El tbody viene a la existencia
        this.$tbody.innerHTML = pageRows.length
            ? pageRows.map(r => `<tr>${r.map(c => `<td class="px-4 py-3 whitespace-nowrap">${c}</td>`).join('')}</tr>`).join('')
            : `<tr><td class="px-4 py-3 text-center text-gray-400" colspan="${this.headers.length}">Sin datos</td></tr>`;

        // Indicador de filtro
        if (this.sortable) {
            this.$thead.querySelectorAll('th').forEach(th => {
                const ind = th.querySelector('.sort-indicator');
                if (!ind) return;
                if (+th.dataset.col === this.sort.index) {
                    ind.classList.remove('hidden');
                    ind.textContent = this.sort.dir === 1 ? '▲' : '▼';
                } else ind.classList.add('hidden');
            });
        }

        // Paginación
        this._renderPagination(totalPages);
    }

    _renderPagination(total) {
        if (!this.paginated) return;
        this.$pagination.classList.remove('hidden');

        const btn = (label, page, disabled = false) =>
            `<button ${disabled ? 'disabled' : ''} data-page="${page}"
               class="px-2 py-1 rounded border text-indigo-600
                      ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-indigo-50'}">${label}</button>`;

        this.$pagination.innerHTML = `
      ${btn('‹', this.page - 1, this.page === 1)}
      <span class="mx-2">${this.page}/${total}</span>
      ${btn('›', this.page + 1, this.page === total)}
    `;

        this.$pagination.querySelectorAll('button[data-page]').forEach(b => {
            b.addEventListener('click', () => {
                this.page = Number(b.dataset.page);
                this._renderBody();
            });
        });
    }
    
}
