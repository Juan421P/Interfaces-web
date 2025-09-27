import { ROUTES } from '../../../js/lib/routes.js';
import { stripScripts } from '../../js/lib/index.js';

export class Checkbox {
  constructor(opts = {}) {
    if (!opts.host) throw new Error('Checkbox requires a host element');

    this.host = typeof opts.host === 'string' ? document.querySelector(opts.host) : opts.host;
    this.label = opts.label || '';
    this.checked = opts.checked || false;
    this.disabled = opts.disabled || false;
    this.onChange = opts.onChange || null;

    this.data = opts.data || null;
    this.field = opts.field || null;
    this.expectedValue = opts.expectedValue || null;

    this.url = opts.url || ROUTES.components.checkbox.html;

    this._render();
  }

  async _render() {
    try {
      const response = await fetch(this.url + '?raw');
      const html = await response.text();
      const template = stripScripts(html);
      this.root = template.content.firstElementChild.cloneNode(true);

      const inputEl = this.root.querySelector('#checkbox-input');
      const labelEl = this.root.querySelector('#checkbox-label');

      if (this.label) labelEl.textContent = this.label;

      if (this.data && this.field && this.expectedValue !== null) {
        this.checked = this.data[this.field] === this.expectedValue;
      }

      inputEl.checked = this.checked;
      inputEl.disabled = this.disabled;

      if (this.onChange) {
        inputEl.addEventListener('change', e => this.onChange(e.target.checked, this.data));
      }

      this.host.innerHTML = '';
      this.host.appendChild(this.root);

    } catch (err) {
      console.error('Checkbox render failed:', err);
    }
  }

  setChecked(val) {
    const inputEl = this.root?.querySelector('#checkbox-input');
    if (inputEl) inputEl.checked = val;
  }

  isChecked() {
    return this.root?.querySelector('#checkbox-input')?.checked || false;
  }
}
