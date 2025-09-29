import { Component } from './../../base/component.js';

export class Checkbox extends Component {
  // ✅ Tu HTML embebido (tal cual)
  static getTemplate() {
    return `
<template id="tmpl-checkbox">
  <label class="flex items-center gap-2 cursor-pointer select-none">
    <input type="checkbox" id="checkbox-input" class="hidden peer" />
    <span class="w-5 h-5 border-2 border-[rgb(var(--text-from))] rounded-md flex items-center justify-center
                peer-checked:bg-[rgb(var(--text-from))] peer-checked:text-white transition-colors duration-200">
      <svg xmlns="http://www.w3.org/2000/svg" class="hidden w-4 h-4 peer-checked:block" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
        <path d="M5 13l4 4L19 7" />
      </svg>
    </span>
    <span id="checkbox-label" class="text-sm"></span>
  </label>
</template>
    `;
  }

  constructor(opts = {}) {
    if (!opts.host) throw new Error('Checkbox requires a host element');
    const host = typeof opts.host === 'string' ? document.querySelector(opts.host) : opts.host;
    if (!host) throw new Error('Checkbox host element not found');

    // ❌ antes: this.url = opts.url || ROUTES.components.checkbox.html;
    super({ host });

    // Props públicas (mantenemos API)
    this.label = opts.label || '';
    this.checked = !!opts.checked;
    this.disabled = !!opts.disabled;
    this.onChange = typeof opts.onChange === 'function' ? opts.onChange : null;

    // Binding por datos
    this.data = opts.data || null;
    this.field = opts.field || null;
    this.expectedValue = opts.expectedValue ?? null;

    // Render inicial
    this._render();
  }

  async _render() {
    try {
      // ✅ montar desde plantilla embebida (sin fetch)
      const t = document.createElement('template');
      t.innerHTML = Checkbox.getTemplate();
      const tmpl = t.content.querySelector('#tmpl-checkbox');
      const cloned = tmpl.content.firstElementChild.cloneNode(true);

      this.root = cloned;

      const inputEl = this.root.querySelector('#checkbox-input');
      const labelEl = this.root.querySelector('#checkbox-label');

      if (labelEl && this.label) labelEl.textContent = this.label;

      // Si hay data/field/expectedValue, calculamos checked a partir de los datos
      if (this.data && this.field && this.expectedValue !== null) {
        this.checked = this.data[this.field] === this.expectedValue;
      }

      if (inputEl) {
        inputEl.checked = this.checked;
        inputEl.disabled = this.disabled;

        if (this.onChange) {
          inputEl.addEventListener('change', e => {
            const value = e.target.checked;
            this.checked = value;
            this.onChange(value, this.data);
          });
        }
      }

      // Montaje
      this.host.innerHTML = '';
      this.host.appendChild(this.root);

    } catch (err) {
      console.error('Checkbox render failed:', err);
      // Fallback mínimo por si algo falla
      this.host.innerHTML = `
        <label class="flex items-center gap-2">
          <input type="checkbox" ${this.checked ? 'checked' : ''} ${this.disabled ? 'disabled' : ''}/>
          <span>${this.label || ''}</span>
        </label>
      `;
      if (this.onChange) {
        this.host.querySelector('input')?.addEventListener('change', e => this.onChange(e.target.checked, this.data));
      }
    }
  }

  // === API utilitaria (igual que antes + un par de helpers) ===
  setChecked(val) {
    const inputEl = this.root?.querySelector('#checkbox-input');
    if (inputEl) {
      inputEl.checked = !!val;
      this.checked = !!val;
    }
  }

  isChecked() {
    return this.root?.querySelector('#checkbox-input')?.checked || false;
  }

  setDisabled(val) {
    const inputEl = this.root?.querySelector('#checkbox-input');
    if (inputEl) {
      inputEl.disabled = !!val;
      this.disabled = !!val;
    }
  }

  setLabel(text) {
    const labelEl = this.root?.querySelector('#checkbox-label');
    if (labelEl) {
      labelEl.textContent = text ?? '';
      this.label = text ?? '';
    }
  }
}
