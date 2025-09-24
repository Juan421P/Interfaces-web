import { ROUTES } from './../../js/lib/routes.js';
import { stripScripts } from '../../js/lib/common.js';

export class SearchInput {

    constructor(opts = {}) {
        this.host = opts.host;
        this.placeholder = opts.placeholder || 'Buscar';
        this.onSearch = typeof opts.onSearch === 'function' ? opts.onSearch : () => { };
        this.root = null;
        this.$input = null;
        this._render();
    }

    async _render() {
        try {
            const txt = await (await fetch(ROUTES.components.searchInput.html + '?raw')).text();
            const tpl = stripScripts(txt);
            this.root = tpl.content.firstElementChild.cloneNode(true);
            this.$input = this.root.querySelector('[data-search-input]');
            if (!this.$input) throw new Error('[SearchInput] template must contain [data-search-input]');
            this.$input.placeholder = this.placeholder;
            this.$input.addEventListener('input', (e) => {
                const val = (e.target.value || '').trim().toLowerCase();
                try { this.onSearch(val); } catch (err) { console.error('[SearchInput] onSearch threw', err); }
            });
            const hostEl = (typeof this.host === 'string') ? document.querySelector(this.host) : this.host;
            if (!hostEl) throw new Error('[SearchInput] host element not found');
            hostEl.innerHTML = '';
            hostEl.appendChild(this.root);
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
        try { this.onSearch(''); } catch (err) { /* ignore */ }
    }
    
}