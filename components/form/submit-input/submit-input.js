import { FormComponent } from './../../base/form-component.js';
import { ROUTES } from '../../../js/lib/routes.js';
import { stripScripts } from '../../../js/lib/common.js';

export class SubmitInput extends FormComponent {
	constructor(opts = {}) {
		if (!opts.host) {
			throw new Error('SubmitInput requires a host element');
		}

		super({
			host: typeof opts.host === 'string' ? document.querySelector(opts.host) : opts.host,
			url: opts.url || ROUTES.components.form.submitInput.html,
			name: opts.name || opts.id || 'submit-input',
			label: opts.label || null,
			required: false, 
			disabled: opts.disabled || false
		});

		
		this.id = opts.id || null;
		this.text = opts.text ?? 'Enviar';
		this.icon = opts.icon ?? '';
		this.fullWidth = opts.fullWidth !== false;
		this.removeIcon = !!opts.removeIcon;
		this.additionalClasses = opts.additionalClasses || '';
		this.onClick = typeof opts.onClick === 'function' ? opts.onClick : null;

		
		this._render();
	}

	async _render() {
		try {
			const res = await fetch(this.url + '?raw');
			const html = await res.text();
			const tpl = stripScripts(html);
			this.root = tpl.content.firstElementChild.cloneNode(true);

			if (this.id) this.root.id = this.id;

			if (this.fullWidth) this.root.classList.add('w-full');
			if (this.additionalClasses) {
				this.additionalClasses.split(/\s+/).filter(Boolean).forEach(c => this.root.classList.add(c));
			}

			const textEl = this.root.querySelector('#submit-text');
			if (textEl) textEl.textContent = this.text;

			const iconWrap = this.root.querySelector('#submit-icon');
			if (iconWrap) {
				if (this.removeIcon) {
					iconWrap.remove();
					this._makeNoIconLayout();
				} else if (this.icon) {
					iconWrap.innerHTML = this.icon;
				}
			}

			if (this.onClick) this.root.addEventListener('click', this.onClick);

		
			this.host.innerHTML = '';
			this.host.appendChild(this.root);

			this.isRendered = true;

		} catch (err) {
			console.error('[SubmitInput] render failed:', err);
			this.host.innerHTML = `<button type="submit" class="px-4 py-3 rounded bg-[rgb(var(--text-from))] text-white">${this.text}</button>`;
			this.root = this.host.querySelector('button');
		}
	}

	_makeNoIconLayout() {
		this.root.classList.remove('grid', 'grid-cols-[auto_1fr]', 'items-center');
		this.root.classList.add('grid', 'grid-cols-1', 'place-items-center');
	}

	
	getValue() {
		return null; 
	}

	setValue(_) { }

	validate() {
		return true; 
	}

	setText(text) {
		const el = this.root?.querySelector('#submit-text');
		if (el) el.textContent = text;
	}

	setIcon(svgString) {
		const wrap = this.root?.querySelector('#submit-icon');
		if (!wrap) return;
		if (svgString) {
			wrap.innerHTML = svgString;
			this.root.classList.remove('grid-cols-1', 'place-items-center');
			this.root.classList.add('grid', 'grid-cols-[auto_1fr]', 'items-center');
		}
	}
}
