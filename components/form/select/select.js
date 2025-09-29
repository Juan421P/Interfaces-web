import { FormComponent } from './../../components.js';

export class Select extends FormComponent {

	static getTemplate() {
		return `
		<template id="tmpl-select">
  			<div class="flex flex-col flex-1 mb-4 lg:mb-0" data-select>
    			<div>
      				<label class="mb-1 ml-2 text-xs font-semibold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent select-none" data-label>Seleccione</label>
    			</div>
    			<div class="relative w-full group">
      				<button type="button" data-btn class="flex items-center justify-between w-full px-4 py-3 transition-all shadow-md bg-gradient-to-r from-[rgb(var(--card-from))] to-[rgb(var(--card-to))] rounded-lg focus:outline-none group-hover:cursor-pointer">
        				<span data-text class="italic text-[rgb(var(--placeholder-from))]">Seleccione</span>
        				<svg viewBox="0 0 24 24" class="w-4 h-4 text-[rgb(var(--text-from))] transition-transform duration-300" data-chevron
          					fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          					<path d="M6 9l6 6 6-6" />
        				</svg>
      				</button>
      				<ul data-menu class="absolute left-0 z-20 hidden w-full mt-1 bg-gradient-to-r from-[rgb(var(--card-from))] to-[rgb(var(--card-to))] drop-shadow rounded-lg"></ul>
      				<input type="text" data-input class="absolute top-0 left-0 z-0 w-1 h-1 opacity-0 pointer-events-none">
    			</div>
  			</div>
		</template>
		`;
	}

	constructor(opts = {}) {
		if (!opts.host) throw new Error('[Select] requires a host element');

		const host = typeof opts.host === 'string' ? document.querySelector(opts.host) : opts.host;
		if (!host) throw new Error('[Select] host element not found');

		super({
			host,
			name: opts.name || 'custom-select',
			label: opts.label || null,
			placeholder: opts.placeholder || 'Seleccione',
			value: ''
		});

		this.hostSel = opts.host;
		this.data = opts.data || [];
		this.tableOrigin = !!opts.tableOrigin;
		this.idField = opts.idField || 'id';
		this.labelField = opts.labelField || 'label';
		this.onChange = typeof opts.onChange === 'function' ? opts.onChange : (() => { });

		this.root = null;
		this.labelEl = null;
		this.btn = null;
		this.textEl = null;
		this.menu = null;
		this.chevron = null;
		this.input = null;

		this.render();
	}

	async render() {
		const t = document.createElement('template');
		t.innerHTML = Select.getTemplate();
		const tmpl = t.content.querySelector('#tmpl-select');

		this.root = tmpl.content.firstElementChild.cloneNode(true);

		this.labelEl = this.root.querySelector('[data-label]');
		this.btn = this.root.querySelector('[data-btn]');
		this.textEl = this.root.querySelector('[data-text]');
		this.menu = this.root.querySelector('[data-menu]');
		this.chevron = this.root.querySelector('[data-chevron]');
		this.input = this.root.querySelector('[data-input]');

		if (this.label) {
			this.labelEl.textContent = this.label;
			this.labelEl.classList.remove('hidden');
		} else {
			this.labelEl.classList.add('hidden');
		}

		this.textEl.textContent = this.placeholder || 'Seleccione';
		this.textEl.classList.add('italic', 'text-[rgb(var(--placeholder-from))]');
		this.input.name = this.name;

		this.populate();
		this.attachEvents();

		const host = (typeof this.host === 'string') ? document.querySelector(this.host) : this.host;
		(host || this.host).innerHTML = '';
		(host || this.host).appendChild(this.root);

		this.isRendered = true;
	}

	populate() {
		this.menu.innerHTML = '';

		const items = this.tableOrigin
			? this.data.map(row => ({
				value: row?.[this.idField],
				text: row?.[this.labelField]
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

			this.value = value;
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
		this.textEl.textContent = this.placeholder || 'Seleccione';
		this.textEl.className = 'italic text-[rgb(var(--placeholder-from))]';
		this.onChange('', this.placeholder || 'Seleccione');

		this.value = '';
	}

	getValue() {
		return this.input?.value ?? '';
	}

	setValue(v) {
		const strV = v == null ? '' : String(v);
		this.input.value = strV;
		this.value = strV;

		let text = this.placeholder || 'Seleccione';
		if (strV) {
			const items = this.tableOrigin
				? this.data.map(row => ({ value: row?.[this.idField], text: row?.[this.labelField] }))
				: this.data.map(opt => ({ value: opt, text: opt }));

			const found = items.find(i => String(i.value) === strV);
			if (found) text = found.text;
		}

		this.textEl.textContent = text;
		if (strV) {
			this.textEl.classList.remove('italic', 'text-[rgb(var(--placeholder-from))]');
			this.textEl.classList.add('bg-gradient-to-r', 'from-[rgb(var(--text-from))]', 'to-[rgb(var(--text-to))]', 'text-transparent', 'bg-clip-text');
		} else {
			this.textEl.className = 'italic text-[rgb(var(--placeholder-from))]';
		}
	}
}
