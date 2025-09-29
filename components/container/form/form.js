export class Form {
    constructor(opts = {}) {
        this.host = typeof opts.host === 'string' ? document.querySelector(opts.host) : opts.host;
        if (!this.host) throw new Error('[Form] host not found');

        this.sections = Array.isArray(opts.sections) ? opts.sections : [];
        this.onSubmit = typeof opts.onSubmit === 'function' ? opts.onSubmit : null;
        this.maxWidthClass = opts.maxWidthClass || 'max-w-md';
        this.formClass = opts.formClass || 'gap-8 px-6 mx-auto md:mx-0 md:px-0 z-50';
        this.fields = {};
        this.validations = {};

        this._initialize();
    }

    static validators = {
        username: str => /^[A-Za-z0-9]+$/.test(str?.trim() || ''),
        simpleText: str => /^[A-Za-zÁÉÍÓÚÑáéíóúñ0-9\s]+$/.test(str?.trim() || ''),
        normalText: str => /^[A-Za-zÁÉÍÓÚÑáéíóúñ0-9.,\s]+$/.test(str?.trim() || ''),
        password: str => /^[A-Za-z0-9#!@&]+$/.test(str?.trim() || ''),
        number: str => /^\d+$/.test(str?.trim() || ''),
        decimal: str => /^\d+(\.\d{1,3})?$/.test(str?.trim() || ''),
        email: str => /^[A-Za-z0-9.]+@[A-Za-z0-9.]+\.(?:[A-Za-z]{2,}|edu\.sv)$/.test(str?.trim() || '')
    };

    async _initialize(){
        await this._render();
    }

    async _render() {
        this.formEl = document.createElement('form');
        this.formEl.classList.add('flex', 'flex-col');

        if (this.maxWidthClass) this.formEl.classList.add(this.maxWidthClass);
        this.formClass.split(/\s+/).filter(Boolean).forEach(c => this.formEl.classList.add(c));

        for (const section of this.sections) {
            const wrapper = document.createElement('section');
            wrapper.classList.add('flex', 'flex-col');

            if (section.opts?.gap) {
                wrapper.classList.add(`gap-${section.opts.gap}`);
            } else {
                wrapper.classList.add('gap-6');
            }

            if (section.opts?.px) {
                wrapper.classList.add(`px-${section.opts.px}`);
            } else {
                wrapper.classList.add('px-0');
            }

            if (section.opts?.py) {
                wrapper.classList.add(`py-${section.opts.py}`);
            }

            if (Array.isArray(section.titles)) {
                for (const t of section.titles) {
                    const tag = `h${Math.min(Math.max(t.relevance || 1, 1), 6)}`;
                    const el = document.createElement(tag);
                    el.textContent = t.text;

                    const classes = Array.isArray(t.classes)
                        ? t.classes
                        : (t.classes || '').split(/\s+/);

                    (classes.length ? classes : ['text-[rgb(var(--card-from))]'])
                        .filter(Boolean)
                        .forEach(c => el.classList.add(c));

                    wrapper.appendChild(el);
                }
            }

            for (const compDef of section.components || []) {
                await this._mountComponent(compDef, wrapper);
            }

            this.formEl.appendChild(wrapper);
        }

        this.formEl.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!this.onSubmit) return;

            const values = {};
            const errors = {};

            for (const [id, comp] of Object.entries(this.fields)) {
                let v = '';
                if (typeof comp.getValue === 'function') {
                    v = comp.getValue();
                } else if (comp.field && comp.field.value !== undefined) {
                    v = comp.field.value;
                } else if (comp.textarea && comp.textarea.value !== undefined) {
                    v = comp.textarea.value;
                } else if (comp.root) {
                    const el = comp.root.querySelector('input,textarea,select');
                    if (el) v = el.value;
                }
                values[id] = v;

                if (this.validations[id]) {
                    for (const rule of this.validations[id]) {
                        const fn = Form.validators[rule];
                        if (typeof fn === 'function') {
                            const ok = fn(v);
                            if (!ok) {
                                if (!errors[id]) errors[id] = [];
                                errors[id].push(rule);
                            }
                        } else {
                            console.warn(`[Form] Unknown validation rule: ${rule}`);
                        }
                    }
                }
            }

            this.onSubmit(values, Object.keys(errors).length > 0 ? errors : null);
        });

        this.host.innerHTML = '';
        this.host.appendChild(this.formEl);
    }

    _mountComponent(compDef, container) {
        const { type, opts = {}, validation = [] } = compDef;
        if (!type || typeof type !== 'function') {
            console.warn('[Form] invalid component type', compDef);
            return;
        }

        const id = opts.id;
        if (!id) throw new Error('[Form] each component must have an id in opts');

        const hostEl = document.createElement('div');
        hostEl.id = `${id}-host`;
        container.appendChild(hostEl);

        const instanceOpts = Object.assign({}, opts, { host: hostEl });
        const instance = new type(instanceOpts);

        this.fields[id] = instance;

        if (validation.length > 0) {
            this.validations[id] = validation;
        }
    }

    getField(id) {
        return this.fields[id];
    }

    getValues() {
        const values = {};
        for (const [id, comp] of Object.entries(this.fields)) {
            if (typeof comp.getValue === 'function') {
                values[id] = comp.getValue();
            } else if (comp.field) {
                values[id] = comp.field.value;
            } else if (comp.textarea) {
                values[id] = comp.textarea.value;
            } else if (comp.root) {
                const el = comp.root.querySelector('input,textarea,select');
                if (el) values[id] = el.value;
            }
        }
        return values;
    }

    setValues(values) {
        Object.keys(values).forEach(key => {
            const comp = this.fields[key];
            if (comp && typeof comp.setValue === 'function') {
                comp.setValue(values[key]);
            } else if (comp && comp.field) {
                comp.field.value = values[key];
            } else if (comp && comp.textarea) {
                comp.textarea.value = values[key];
            } else if (comp && comp.root) {
                const el = comp.root.querySelector('input,textarea,select');
                if (el) el.value = values[key];
            }
        });
    }

    reset() {
        for (const comp of Object.values(this.fields)) {
            if (typeof comp.reset === 'function') {
                comp.reset();
            } else if (comp.field) {
                comp.field.value = '';
            } else if (comp.textarea) {
                comp.textarea.value = '';
            } else if (comp.root) {
                const el = comp.root.querySelector('input,textarea,select');
                if (el) el.value = '';
            }
        }
    }
}