export class Cards {
    constructor(opts = {}) {
        if (!opts.host) throw new Error('[Cards] host is required');
        this.host = typeof opts.host === 'string' ? document.querySelector(opts.host) : opts.host;
        if (!this.host) throw new Error('[Cards] host element not found');

        if (!opts.service || typeof opts.service.list !== 'function') {
            throw new Error('[Cards] service with list() is required');
        }

        this.service = opts.service;
        this.serviceEventPrefix = opts.serviceEventPrefix || null;
        this.templateId = opts.templateId || null;
        this.bindings = Array.isArray(opts.bindings) ? opts.bindings : [];
        this.onCardClick = typeof opts.onCardClick === 'function' ? opts.onCardClick : null;

        this.$grid = this.host.querySelector('[data-cards-grid]') || this.host;
        this.data = [];

        this._boundServiceHandler = this._onServiceEvent.bind(this);
        this._init();
    }

    async _init() {
        await this._fetchAndRender();
        this._bindServiceEvents();
    }

    _bindServiceEvents() {
        if (!this.serviceEventPrefix) return;
        const prefix = String(this.serviceEventPrefix);

        ['list', 'create', 'update', 'delete'].forEach(evt => {
            document.addEventListener(`${prefix}:${evt}`, this._boundServiceHandler, { passive: true });
        });
    }

    _unbindServiceEvents() {
        if (!this.serviceEventPrefix) return;
        const prefix = String(this.serviceEventPrefix);
        ['list', 'create', 'update', 'delete'].forEach(evt => {
            document.removeEventListener(`${prefix}:${evt}`, this._boundServiceHandler, { passive: true });
        });
    }

    async _onServiceEvent(e) {
        if (this._refreshing) return;
        try {
            this._refreshing = true;
            await this._fetchAndRender();
        } finally {
            this._refreshing = false;
        }
    }

    _resolveTemplate() {
        if (!this.templateId) throw new Error('[Cards] templateId is required');
        const el = document.querySelector(this.templateId);
        if (!el) throw new Error(`[Cards] template not found: ${this.templateId}`);
        return el;
    }

    async _fetchAndRender() {
        try {
            const data = await this.service.list();
            this.data = Array.isArray(data) ? data : (data ? [data] : []);
        } catch (err) {
            console.error('[Cards] failed to fetch data from service', err);
            this.data = [];
        }
        this._render();
    }

    _render() {
        this.$grid.innerHTML = '';

        if (!this.data || this.data.length === 0) {
            this.$grid.innerHTML = '<p class="text-indigo-400">No hay registros 😅</p>';
            return;
        }

        const tpl = this._resolveTemplate();

        for (let idx = 0; idx < this.data.length; idx++) {
            const item = this.data[idx];
            const node = tpl.content.cloneNode(true);
            const cardEl = node.querySelector('[data-card]') || node.firstElementChild;

            if (cardEl) cardEl.classList.add('mb-4');

            for (const b of this.bindings) {
                try {
                    if (!b || !b.selector) continue;
                    const targets = Array.from(node.querySelectorAll(b.selector || ''));
                    if (!targets.length) {
                        continue;
                    }

                    for (const target of targets) {
                        let rawVal = this._valueFromKey(item, b.key, b.transform);

                        if (typeof b.transform === 'function') {
                            try {
                                rawVal = b.transform(rawVal, item, node, target, idx);
                            } catch (tErr) {
                                console.error('[Cards] binding transform error', tErr);
                            }
                        }

                        const mode = b.mode || 'text';
                        if (mode === 'attr' && b.attr) {
                            if (b.attr === 'src') {
                                const placeholder = target.parentElement?.querySelector('.placeholder');
                                if (!rawVal) {
                                    target.style.display = 'none';
                                    if (placeholder) placeholder.style.display = 'flex';
                                    else target.removeAttribute('src');
                                } else {
                                    target.style.display = '';
                                    target.setAttribute('src', String(rawVal));
                                    if (placeholder) placeholder.style.display = 'none';
                                }
                            } else {
                                target.setAttribute(b.attr, rawVal ?? '');
                            }
                        } else if (mode === 'html') {
                            target.innerHTML = rawVal ?? '';
                            if ((target.innerHTML == null || target.innerHTML.trim() === '') && (rawVal !== null && rawVal !== undefined && String(rawVal).trim() !== '')) {
                                target.textContent = String(rawVal);
                            }
                        } else {
                            target.textContent = rawVal ?? '';
                        }
                    }
                } catch (bindErr) {
                    console.error('[Cards] binding failed for', b, bindErr);
                }
            }

            if (this.onCardClick && cardEl) {
                cardEl.addEventListener('click', () => this.onCardClick(item, cardEl));
            }

            this.$grid.appendChild(node);
        }
    }

    _valueFromKey(obj, key, transform) {
        if (!key) return '';
        const parts = String(key).split('.');
        let val = obj;
        for (const p of parts) {
            if (val == null) { val = undefined; break; }
            val = val[p];
        }
        return typeof transform === 'function' ? transform(val, obj) : val;
    }

    async refresh() {
        await this._fetchAndRender();
    }

    destroy() {
        this._unbindServiceEvents();
    }
}
