import { ROUTES } from './../../js/helpers/routes';
import { stripScripts } from './../../js/helpers';

export class Form {
    constructor(opts = {}) {
        Object.assign(this, {
            hostSel: opts.host,
            url: opts.url || ROUTES.components.form.html,
            layout: opts.layout || 'grid',
            columns: opts.columns || 2,
            inputs: opts.inputs || [],
            onSubmit: opts.onSubmit || (() => { }),
            onSubmitValidation: opts.onSubmitValidation || null,
            validation: opts.validation !== false,
            className: opts.className || '',
            renderMode: opts.renderMode || 'append'
        });

        this._load();
    }

    async _load() {
        const txt = await (await fetch(this.url + '?raw')).text();
        const html = stripScripts(txt);

        const wrapper = document.createElement('div');
        wrapper.innerHTML = html;

        this.formEl = wrapper.querySelector('#custom-form');
        this.itemTemplate = wrapper.querySelector('#form-item-template');

        if (this.layout === 'grid') {
            this.formEl.style.gridTemplateColumns = `repeat(${this.columns}, minmax(0, 1fr))`;
        } else if (this.layout === 'flex') {
            this.formEl.style.display = 'flex';
            this.formEl.style.flexDirection = 'column';
        }

        this._buildForm();
    }

    _buildForm() {
        this.inputs.forEach(item => {
            const clone = document.importNode(this.itemTemplate.content, true);
            const itemEl = clone.querySelector('.form-item');

            const preview = clone.querySelector('.form-preview');
            if (item.preview && item.component.type === 'image') {
                item.component.onFileSelect = file => {
                    if (file) {
                        preview.src = URL.createObjectURL(file);
                        preview.classList.remove('hidden');
                    } else {
                        preview.classList.add('hidden');
                    }
                };
            } else {
                preview.remove();
            }

            const compSlot = clone.querySelector('.form-component');
            compSlot.appendChild(item.component.root);

            this.formEl.appendChild(clone);
        });

        this.formEl.addEventListener('submit', e => {
            e.preventDefault();
            this._handleSubmit();
        });

        if (this.renderMode === 'append') {
            const host = document.querySelector(this.hostSel);
            host.innerHTML = '';
            host.appendChild(this.formEl);
        }
    }

    getHTML() {
        return this.formEl;
    }

    _handleSubmit() {
        const data = {};
        let valid = true;

        this.inputs.forEach(item => {
            const id = item.id || `field_${Math.random()}`;
            if (typeof item.component.getValue === 'function') {
                data[id] = item.component.getValue();
            }
            if (this.validation && typeof item.component.validate === 'function') {
                if (!item.component.validate(item.validationType)) {
                    valid = false;
                }
            }
        });

        if (valid && typeof this.onSubmitValidation === 'function') {
            const finalCheck = this.onSubmitValidation(data);
            if (finalCheck === false) {
                valid = false;
            }
        }

        if (!valid) return;

        this.onSubmit(data);
    }
}
