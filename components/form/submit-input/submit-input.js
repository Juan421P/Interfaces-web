import { FormComponent } from './../../components.js';

export class SubmitInput extends FormComponent {
  // ✅ tu HTML embebido en un <template>
  static getTemplate() {
    return `
<template id="tmpl-submit-input">
  <button id="submit-input" type="submit"
    class="p-6 w-full bg-gradient-to-tr from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] text-white text-shadow rounded-xl grid grid-cols-[auto_1fr] items-center shadow-md hover:brightness-120 hover:scale-[1.015] transition-all duration-300 cursor-pointer select-none">
    <span id="submit-icon" class="inline-flex items-center justify-center">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" class="svg-shadow"
        xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd"
          d="M20 6.66668C12.6362 6.66668 6.66671 12.6362 6.66671 20C6.66671 27.3638 12.6362 33.3333 20 33.3333C27.3638 33.3333 33.3334 27.3638 33.3334 20C33.3334 12.6362 27.3638 6.66668 20 6.66668ZM3.33337 20C3.33337 10.7953 10.7953 3.33334 20 3.33334C29.2048 3.33334 36.6667 10.7953 36.6667 20C36.6667 29.2048 29.2048 36.6667 20 36.6667C10.7953 36.6667 3.33337 29.2048 3.33337 20ZM18.8215 16.1785C18.1707 15.5276 18.1707 14.4724 18.8215 13.8215C19.4724 13.1706 20.5277 13.1706 21.1786 13.8215L26.1786 18.8215C26.8294 19.4724 26.8294 20.5276 26.1786 21.1785L21.1786 26.1785C20.5277 26.8294 19.4724 26.8294 18.8215 26.1785C18.1707 25.5276 18.1707 24.4724 18.8215 23.8215L20.9764 21.6667H15C14.0796 21.6667 13.3334 20.9205 13.3334 20C13.3334 19.0795 14.0796 18.3333 15 18.3333H20.9764L18.8215 16.1785Z"
          fill="white" />
      </svg>
    </span>
    <span id="submit-text" class="block w-full font-medium text-center">Enviar</span>
  </button>
</template>
    `;
  }

  constructor(opts = {}) {
    if (!opts.host) throw new Error('SubmitInput requires a host element');

    super({
      host: typeof opts.host === 'string' ? document.querySelector(opts.host) : opts.host,
      // url: opts.url || ROUTES.components.form.submitInput.html, // ❌ deprecado
      name: opts.name || opts.id || 'submit-input',
      label: opts.label || null,
      required: false,
      disabled: !!opts.disabled
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
      // ❌ Antes: fetch + stripScripts
      // ✅ Ahora: clonar desde plantilla embebida
      const t = document.createElement('template');
      t.innerHTML = SubmitInput.getTemplate();
      const tmpl = t.content.querySelector('#tmpl-submit-input');
      this.root = tmpl.content.firstElementChild.cloneNode(true);

      if (this.id) this.root.id = this.id;

      if (this.fullWidth) this.root.classList.add('w-full');
      if (this.additionalClasses) {
        this.additionalClasses
          .split(/\s+/)
          .filter(Boolean)
          .forEach(c => this.root.classList.add(c));
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

      if (this.onClick) {
        this.root.addEventListener('click', this.onClick);
      }

      this.host.innerHTML = '';
      this.host.appendChild(this.root);
      this.isRendered = true;

    } catch (err) {
      console.error('[SubmitInput] render failed:', err);
      this.host.innerHTML =
        `<button type="submit" class="px-4 py-3 rounded bg-[rgb(var(--text-from))] text-white">${this.text}</button>`;
      this.root = this.host.querySelector('button');
      this.isRendered = true;
    }
  }

  _makeNoIconLayout() {
    this.root.classList.remove('grid', 'grid-cols-[auto_1fr]', 'items-center');
    this.root.classList.add('grid', 'grid-cols-1', 'place-items-center');
  }

  // API de FormComponent (botón no guarda valor)
  getValue() { return null; }
  setValue(_) {}
  validate() { return true; }

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
