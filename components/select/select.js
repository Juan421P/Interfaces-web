import { ROUTES } from './../../js/lib/routes.js';
import { stripScripts } from '../../js/lib/index.js';

export class Select {
    /**
     * @param {Object} opts
     * @param {string} opts.host
     * @param {string} [opts.url]
     * @param {Array} opts.data
     * @param {boolean} [opts.tableOrigin=false]
     * @param {string} [opts.idField='id']
     * @param {string} [opts.labelField='label']
     * @param {string} [opts.placeholder='Seleccione']
     * @param {string} [opts.label]
     * @param {string} [opts.name='custom-select']
     * @param {function} [opts.onChange]
     */
    constructor(opts = {}) {
        Object.assign(this, {
            hostSel: opts.host,
            url: opts.url || ROUTES.components.select.html,
            data: opts.data || [],
            tableOrigin: opts.tableOrigin || false,
            idField: opts.idField || 'id',
            labelField: opts.labelField || 'label',
            placeholder: opts.placeholder || 'Seleccione',
            label: opts.label || null,
            name: opts.name || 'custom-select',
            onChange: opts.onChange || (() => { })
        });

        this.render();
    }

    async render() {
        const txt = await (await fetch(this.url + '?raw')).text();
        const tpl = stripScripts(txt);

        this.root = tpl.content.firstElementChild;

        this.labelEl = this.root.querySelector('[data-label]');
        this.btn = this.root.querySelector('[data-btn]');
        this.textEl = this.root.querySelector('[data-text]');
        this.menu = this.root.querySelector('[data-menu]');
        this.chevron = this.root.querySelector('[data-chevron]');
        this.input = this.root.querySelector('[data-input]');

        if (this.label) {
            this.labelEl.textContent = this.label;
        } else {
            this.labelEl.classList.add('hidden');
        }

        this.textEl.textContent = this.placeholder;
        this.textEl.classList.add('italic', 'text-[rgb(var(--placeholder-from))]');
        this.input.name = this.name;

        this.populate();
        this.attachEvents();

        const host = document.querySelector(this.hostSel);
        host.innerHTML = '';
        host.appendChild(this.root);
    }

    populate() {
        this.menu.innerHTML = '';

        const items = this.tableOrigin
            ? this.data.map(row => ({
                value: row[this.idField],
                text: row[this.labelField]
            }))
            : this.data.map(opt => ({ value: opt, text: opt }));

        items.forEach((item, idx) => {
            const li = document.createElement('li');
            li.className = `px-4 py-3 hover:bg-[rgb(var(--body-from))] transition-all duration-300 cursor-pointer 
                ${idx === 0 ? 'rounded-t-lg' : ''} 
                ${idx === items.length - 1 ? 'rounded-b-lg' : ''}`;
            li.dataset.value = item.value;

            const span = document.createElement('span');
            span.textContent = item.text;
            span.className = 'bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] text-transparent bg-clip-text';

            li.appendChild(span);
            this.menu.appendChild(li);
        });
    }

    attachEvents() {
        this.btn.addEventListener('click', () => {
            this.menu.classList.toggle('hidden');
            this.chevron.classList.toggle('rotate-180');
        });

        this.menu.addEventListener('click', e => {
            const li = e.target.tagName === 'LI' ? e.target : e.target.closest('li');
            if (!li) return;

            const value = li.dataset.value;
            const text = li.textContent.trim();

            this.input.value = value;
            this.textEl.textContent = text;

            this.textEl.classList.remove('italic', 'text-[rgb(var(--placeholder-from))]');
            this.textEl.classList.add('bg-gradient-to-r', 'from-[rgb(var(--text-from))]', 'to-[rgb(var(--text-to))]', 'text-transparent', 'bg-clip-text');

            this.menu.classList.add('hidden');
            this.chevron.classList.remove('rotate-180');

            this.onChange(value, text);
        });

        document.addEventListener('click', e => {
            if (!this.btn.contains(e.target) && !this.menu.contains(e.target)) {
                this.menu.classList.add('hidden');
                this.chevron.classList.remove('rotate-180');
            }
        });

        this.root.addEventListener('contextmenu', e => {
            e.preventDefault();
            this.reset();
        });
    }

    reset() {
        this.input.value = '';
        this.textEl.textContent = this.placeholder;
        this.textEl.className = 'italic text-[rgb(var(--placeholder-from))]';
        this.onChange('', this.placeholder);
    }
}
