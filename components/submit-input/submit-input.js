// submitInput.js
import { ROUTES } from '../../js/helpers/routes.js';
import { stripScripts } from '../../js/helpers/common-methods.js';

export class SubmitInput {
	constructor(opts = {}) {
		Object.assign(this, {
			id: opts.id || null,
			host: typeof opts.host === 'string' ? document.querySelector(opts.host) : opts.host || null,
			text: opts.text ?? 'Enviar',
			icon: opts.icon ?? '',
			url: opts.url || ROUTES.components.submitInput.html,
			fullWidth: opts.fullWidth !== false,
			removeIcon: !!opts.removeIcon,
			additionalClasses: opts.additionalClasses || '',
			onClick: typeof opts.onClick === 'function' ? opts.onClick : null
		});

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

			if (this.host && this.host instanceof HTMLElement) {
				this.host.innerHTML = '';
				this.host.appendChild(this.root);
			} else if (this.host && typeof this.host === 'string') {
				const hostEl = document.querySelector(this.host);
				if (hostEl) {
					hostEl.innerHTML = '';
					hostEl.appendChild(this.root);
				}
			}
		} catch (err) {
			console.error('[SubmitInput] render failed:', err);
			if (this.host && this.host instanceof HTMLElement) {
				this.host.innerHTML = `<button type="submit" class="px-4 py-3 rounded bg-[rgb(var(--text-from))] text-white">${this.text}</button>`;
			} else {
				const fallback = document.createElement('div');
				fallback.innerHTML = `<button type="submit" class="px-4 py-3 rounded bg-[rgb(var(--text-from))] text-white">${this.text}</button>`;
				document.body.appendChild(fallback);
				this.root = fallback.firstElementChild;
			}
		}
	}

	_makeNoIconLayout() {
		this.root.classList.remove('grid', 'grid-cols-[auto_1fr]', 'items-center');
		this.root.classList.add('grid', 'grid-cols-1', 'place-items-center');
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

	getValue() {
		return null;
	}

	setValue(_) { }
	validate() { return true; }

}
