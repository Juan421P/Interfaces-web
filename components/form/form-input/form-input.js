import { FormComponent } from './../../components.js';

const allowedKeys = [
	'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Home', 'End', 'Enter'
];

const patterns = {
	username: /^[A-Za-z0-9]$/,
	simpleText: /^[A-Za-zÁÉÍÓÚÑáéíóúñ0-9\s]$/,
	normalText: /^[A-Za-zÁÉÍÓÚÑáéíóúñ0-9.,\s]$/,
	password: /^[A-Za-z0-9#!@&]$/,
	number: /^\d$/,
	decimal: /^\d*\.?\d{0,3}$/,
	email: /^[A-Za-z0-9@.]$/
};

export class FormInput extends FormComponent {

	static getTemplate() {
		return `
<template id="tmpl-form-input">
  <div class="flex flex-col flex-1" data-input>
    <div>
      <label data-label
        class="mb-1 ml-2 text-xs font-semibold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent select-none">
      </label>
    </div>
    <div class="relative w-full" data-input-wrapper>
      <input type="text" data-field
        class="px-4 py-3 shadow-md rounded-lg w-full bg-gradient-to-r from-[rgb(var(--card-from))] to-[rgb(var(--card-to))] placeholder-[rgb(var(--placeholder-from))] focus:outline-none transition-all duration-300 placeholder:italic text-[rgb(var(--text-from))]">
      <button type="button" data-password-btn class="absolute inset-y-0 flex items-center right-3">
        <svg data-eye-open xmlns="http://www.w3.org/2000/svg"
          class="text-[rgb(var(--placeholder-from))] hover:text-[rgb(var(--text-from))] w-5 h-5 stroke-current fill-none cursor-pointer transition-colors duration-300"
          viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <svg data-eye-closed xmlns="http://www.w3.org/2000/svg"
          class="hidden text-[rgb(var(--placeholder-from))] hover:text-[rgb(var(--text-from))] w-5 h-5 stroke-current fill-none cursor-pointer transition-colors duration-300"
          viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
          <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
          <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
          <path d="m2 2 20 20" />
        </svg>
      </button>
    </div>
    <textarea data-textarea
      class="px-4 py-3 shadow-md rounded-lg w-full bg-gradient-to-r from-[rgb(var(--card-from))] to-[rgb(var(--card-to))] placeholder-[rgb(var(--placeholder-from))] focus:outline-none transition-all duration-300 placeholder:italic text-[rgb(var(--text-from))] hidden"></textarea>
  </div>
</template>
    `;
	}

	constructor(opts = {}) {
		if (!opts.host) throw new Error('FormInput requires a host element');
		const host = typeof opts.host === 'string' ? document.querySelector(opts.host) : opts.host;
		if (!host) throw new Error('FormInput host element not found');

		super({
			host,
			name: opts.name || opts.id || 'custom-input',
			label: opts.label || null
		});

		this.type = opts.type || 'text';
		this.placeholder = opts.placeholder || '';
		this.onChange = opts.onChange || (() => { });
		this.validationMethod = opts.validationMethod || null;
		this.numberInputOpts = opts.numberInputOpts || {};
		this.rows = opts.rows || 3;
		this.id = opts.id || null;

		this._validateNumberOpts();
		this._render();
	}

	_validateNumberOpts() {
		if (this.type !== 'number') return;
		const { min, max, step, allowsDecimals } = this.numberInputOpts;
		if (allowsDecimals === false) {
			[min, max, step].forEach(val => {
				if (val !== undefined && val % 1 !== 0) {
					throw new Error('[FormInput]', `NumberInput property ${val} must be integer when allowsDecimals is false`);
				}
			});
		}
	}

	async _render() {
		try {
			const t = document.createElement('template');
			t.innerHTML = FormInput.getTemplate();
			const tmpl = t.content.querySelector('#tmpl-form-input');
			this.root = tmpl.content.firstElementChild.cloneNode(true);

			if (this.id) this.root.id = this.id;

			this.labelEl = this.root.querySelector('[data-label]');
			this.field = this.root.querySelector('[data-field]');
			this.textarea = this.root.querySelector('[data-textarea]');
			this.pwBtn = this.root.querySelector('[data-password-btn]');
			this.eyeOpen = this.root.querySelector('[data-eye-open]');
			this.eyeClosed = this.root.querySelector('[data-eye-closed]');

			// Label
			if (this.label) {
				if (this.labelEl) this.labelEl.textContent = this.label;
			} else {
				if (this.labelEl) this.labelEl.classList.add('hidden');
			}

			if (this.type === 'textarea') {
				this._setupTextarea();
			} else {
				this._setupInputField();
			}

			this._attachEvents();

			this.host.innerHTML = '';
			this.host.appendChild(this.root);

		} catch (error) {
			console.error('FormInput render failed:', error);
			this.host.innerHTML = `
        <div class="form-input" ${this.id ? `id="${this.id}"` : ''}>
          ${this.label ? `<label>${this.label}</label>` : ''}
          <input type="${this.type}" name="${this.name}" placeholder="${this.placeholder}" ${this.id ? `id="${this.id}"` : ''} />
        </div>
      `;
		}
	}

	_setupTextarea() {
		if (this.field) this.field.classList.add('hidden');
		if (this.pwBtn) this.pwBtn.classList.add('hidden');
		if (this.textarea) {
			this.textarea.classList.remove('hidden');
			this.textarea.name = this.name;
			this.textarea.placeholder = this.placeholder;
			this.textarea.rows = this.rows;
			if (this.id) this.textarea.id = this.id;
		}
	}

	_setupInputField() {
		if (this.field) {
			this.field.classList.remove('hidden');
			this.field.name = this.name;
			this.field.placeholder = this.placeholder;
			if (this.id) this.field.id = this.id;
			if (this.textarea) this.textarea.classList.add('hidden');

			if (this.type === 'password') {
				this.field.type = 'password';
				if (this.eyeOpen) this.eyeOpen.classList.add('hidden');
				if (this.eyeClosed) this.eyeClosed.classList.remove('hidden');
			} else {
				this.field.type = this.type === 'number' ? 'number' : this.type;
				if (this.pwBtn) this.pwBtn.classList.add('hidden');
			}
		}

		if (this.type === 'number' && this.field) {
			const { min, max, step } = this.numberInputOpts;
			if (min !== undefined) this.field.min = min;
			if (max !== undefined) this.field.max = max;
			if (step !== undefined) this.field.step = step;
		}
	}

	_attachEvents() {
		const inputEl = this.type === 'textarea' ? this.textarea : this.field;
		if (!inputEl) return;

		if (this.type === 'password' && this.pwBtn) {
			this.pwBtn.addEventListener('click', () => {
				const hidden = inputEl.type === 'password';
				inputEl.type = hidden ? 'text' : 'password';
				if (this.eyeOpen) this.eyeOpen.classList.toggle('hidden', !hidden);
				if (this.eyeClosed) this.eyeClosed.classList.toggle('hidden', hidden);
			});
		}

		if (this.validationMethod && patterns[this.validationMethod]) {
			inputEl.addEventListener('keydown', e => {
				if (allowedKeys.includes(e.key) || e.ctrlKey || e.metaKey) return;
				if (!patterns[this.validationMethod].test(e.key)) e.preventDefault();
			});
			inputEl.addEventListener('paste', e => e.preventDefault());
		}

		inputEl.addEventListener('input', () => {
			this.onChange(inputEl.value);
		});
	}

	getHTML() {
		return this.root;
	}

	getValue() {
		const el = this.type === 'textarea' ? this.textarea : this.field;
		return el?.value ?? '';
	}

	setValue(value) {
		const el = this.type === 'textarea' ? this.textarea : this.field;
		if (el) el.value = value;
	}

	validate(validationType = this.validationMethod) {
		const val = this.getValue();
		if (!validationType) return true;
		if (validationType === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
		if (validationType === 'password') return val.length >= 8 && val.length <= 256;
		return true;
	}

	reset() {
		const inputEl = this.type === 'textarea' ? this.textarea : this.field;
		if (inputEl) inputEl.value = '';
		this.onChange('');
	}
}
