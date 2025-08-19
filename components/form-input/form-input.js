// formInput.js
import { ROUTES } from '../../js/helpers/routes.js';
import { stripScripts } from '../../js/helpers/common-methods.js';

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

export class FormInput {
	constructor(opts = {}) {
		Object.assign(this, {
			id: opts.id || null,
			host: typeof opts.host === 'string' ? document.querySelector(opts.host) : opts.host || null,
			url: opts.url || ROUTES.components.formInput.html,
			type: opts.type || 'text',
			label: opts.label || null,
			placeholder: opts.placeholder || '',
			name: opts.name || opts.id || 'custom-input',
			onChange: opts.onChange || (() => { }),
			validationMethod: opts.validationMethod || null,
			numberInputOpts: opts.numberInputOpts || {},
			rows: opts.rows || 3
		});

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
		const txt = await (await fetch(this.url + '?raw')).text();
		const tpl = stripScripts(txt);

		this.root = tpl.content.firstElementChild.cloneNode(true);
		if (this.id) this.root.id = this.id;

		this.labelEl = this.root.querySelector('[data-label]');
		this.field = this.root.querySelector('[data-field]');
		this.textarea = this.root.querySelector('[data-textarea]');
		this.pwBtn = this.root.querySelector('[data-password-btn]');
		this.eyeOpen = this.root.querySelector('[data-eye-open]');
		this.eyeClosed = this.root.querySelector('[data-eye-closed]');

		if (this.label) {
			if (this.labelEl) this.labelEl.textContent = this.label;
		} else {
			if (this.labelEl) this.labelEl.classList.add('hidden');
		}

		if (this.type === 'textarea') {
			if (this.field) this.field.classList.add('hidden');
			if (this.pwBtn) this.pwBtn.classList.add('hidden');
			if (this.textarea) {
				this.textarea.classList.remove('hidden');
				this.textarea.name = this.name;
				this.textarea.placeholder = this.placeholder;
				this.textarea.rows = this.rows;
			}
		} else {
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
					this.field.type = this.type === 'number' ? 'number' : 'text';
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

		this._attachEvents();

		if (this.host && this.host instanceof HTMLElement) {
			this.host.innerHTML = '';
			this.host.appendChild(this.root);
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
				if (!patterns[this.validationMethod].test(e.key)) {
					e.preventDefault();
				}
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
		if (validationType === 'email') {
			return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
		}
		if (validationType === 'password') {
			return val.length >= 8 && val.length <= 256;
		}
		return true;
	}

	reset() {
		const inputEl = this.type === 'textarea' ? this.textarea : this.field;
		if (inputEl) inputEl.value = '';
		this.onChange('');
	}
}
