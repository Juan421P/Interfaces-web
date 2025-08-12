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
			hostSel: opts.host,
			url: opts.url || ROUTES.components.formInput.html,
			type: opts.type || 'text',
			label: opts.label || null,
			placeholder: opts.placeholder || '',
			name: opts.name || 'custom-input',
			onChange: opts.onChange || (() => {}),
			validationMethod: opts.validationMethod || null,
			numberInputOpts: opts.numberInputOpts || {},
			rows: opts.rows || 3,
			renderMode: opts.renderMode || 'append'
		});

		this.validateNumberOpts();
		this.render();
	}

	validateNumberOpts() {
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

	async render() {
		const txt = await (await fetch(this.url + '?raw')).text();
		const tpl = stripScripts(txt);

		this.root = tpl.content.firstElementChild;
		this.labelEl = this.root.querySelector('[data-label]');
		this.field = this.root.querySelector('[data-field]');
		this.textarea = this.root.querySelector('[data-textarea]');
		this.pwBtn = this.root.querySelector('[data-password-btn]');
		this.eyeOpen = this.root.querySelector('[data-eye-open]');
		this.eyeClosed = this.root.querySelector('[data-eye-closed]');

		if (this.label) {
			this.labelEl.textContent = this.label;
		} else {
			this.labelEl.classList.add('hidden');
		}

		if (this.type === 'textarea') {
			this.field.classList.add('hidden');
			this.pwBtn.classList.add('hidden');
			this.textarea.classList.remove('hidden');
			this.textarea.name = this.name;
			this.textarea.placeholder = this.placeholder;
			this.textarea.rows = this.rows;
		} else {
			this.field.type = this.type === 'password' ? 'password' : (this.type === 'number' ? 'number' : 'text');
			this.field.name = this.name;
			this.field.placeholder = this.placeholder;

			if (this.type !== 'password') {
				this.pwBtn.classList.add('hidden');
			}
			if (this.type === 'number') {
				const { min, max, step } = this.numberInputOpts;
				if (min !== undefined) this.field.min = min;
				if (max !== undefined) this.field.max = max;
				if (step !== undefined) this.field.step = step;
			}
		}

		this.attachEvents();

		if (this.renderMode === 'append') {
			const host = document.querySelector(this.hostSel);
			host.innerHTML = '';
			host.appendChild(this.root);
		}
	}

	getHTML() {
		return this.root;
	}

	attachEvents() {
		const inputEl = this.type === 'textarea' ? this.textarea : this.field;

		if (this.type === 'password') {
			this.pwBtn.addEventListener('click', () => {
				const hidden = inputEl.type === 'password';
				inputEl.type = hidden ? 'text' : 'password';
				this.eyeOpen.classList.toggle('hidden', !hidden);
				this.eyeClosed.classList.toggle('hidden', hidden);
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

	reset() {
		const inputEl = this.type === 'textarea' ? this.textarea : this.field;
		inputEl.value = '';
		inputEl.className = inputEl.className.replace(/bg-gradient-to-r.*bg-clip-text/, '').trim();
		inputEl.classList.add('text-[rgb(var(--placeholder-from))]', 'italic');
		this.onChange('');
	}
}
