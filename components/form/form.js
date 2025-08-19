export class Form {
    constructor(opts = {}) {
        this.host = typeof opts.host === 'string' ? document.querySelector(opts.host) : opts.host;
        if (!this.host) throw new Error('[Form] host not found');

        this.templateId = opts.templateId;
        this.template = document.getElementById(this.templateId);
        if (!this.template) throw new Error(`[Form] Template #${this.templateId} not found`);

        this.components = Array.isArray(opts.components) ? opts.components : [];
        this.onSubmit = typeof opts.onSubmit === 'function' ? opts.onSubmit : null;
        this.maxWidthClass = opts.maxWidthClass || 'max-w-md';
        this.formClass = opts.formClass || 'gap-20 px-6 mx-auto md:mx-0 md:px-0';
        this.fields = {};
        this.validations = {};

        this._render();
    }

    static validators = {
        username: str => /^[A-Za-z0-9]+$/.test(str.trim()),
        simpleText: str => /^[A-Za-zÁÉÍÓÚÑáéíóúñ0-9\s]+$/.test(str.trim()),
        normalText: str => /^[A-Za-zÁÉÍÓÚÑáéíóúñ0-9.,\s]+$/.test(str.trim()),
        password: str => /^[A-Za-z0-9#!@&]+$/.test(str.trim()),
        number: str => /^\d+$/.test(str.trim()),
        decimal: str => /^\d+(\.\d{1,3})?$/.test(str.trim()),
        email: str => /^[A-Za-z0-9.]+@[A-Za-z0-9.]+\.(?:[A-Za-z]{2,}|edu\.sv)$/.test(str.trim())
    };

    _render() {
        const tpl = this.template.content.cloneNode(true);
        this.formEl = tpl.querySelector('form');
        if (!this.formEl) throw new Error('[Form] template must contain a <form> element');

        this.formEl.classList.add('flex', 'flex-col');
        if (this.maxWidthClass) this.formEl.classList.add(this.maxWidthClass);
        this.formClass.split(/\s+/).filter(Boolean).forEach(c => this.formEl.classList.add(c));

        for (const compDef of this.components) {
            const { type, opts = {}, validation = [] } = compDef;
            if (!type || typeof type !== 'function') {
                console.warn('[Form] invalid component type', compDef);
                continue;
            }
            const id = opts.id;
            if (!id) throw new Error('[Form] each component must have an id in opts');

            const hostEl = this.formEl.querySelector(`#${id}-host`);
            if (!hostEl) {
                throw new Error(`[Form] Host element #${id}-host not found in template`);
            }

            const instanceOpts = Object.assign({}, opts, { host: hostEl });
            const instance = new type(instanceOpts);

            this.fields[id] = instance;

            if (validation.length > 0) {
                this.validations[id] = validation;
            }
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

            if (Object.keys(errors).length > 0) {
                this.onSubmit(values, errors);
                return;
            }

            this.onSubmit(values, null);
        });

        this.host.innerHTML = '';
        this.host.appendChild(this.formEl);
    }

    getField(id) {
        return this.fields[id];
    }
}