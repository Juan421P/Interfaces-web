import { ROUTES } from './../../js/lib/routes.js';
import { stripScripts } from './../../js/lib/index.js';

export class Cards {
    /**
     * @param {Object} opts
     * @param {string|HTMLElement} opts.host
     * @param {Array|Object} [opts.data=[]]
     * @param {string} [opts.url=ROUTES.components.cards.html]
     * @param {'tile'|'block'} [opts.variant='tile']
     * @param {string} [opts.templateId]
     * @param {Array} [opts.bindings=[]]
     * @param {string} [opts.gridClass]
     * @param {string} [opts.itemClass] 
     * @param {Function} [opts.onCardClick]
     * @param {Object} [opts.contextMenu]
     */
    constructor(opts = {}) {
        if (!opts.host) throw new Error('[Cards] host is required');

        this.host = typeof opts.host === 'string' ? document.querySelector(opts.host) : opts.host;
        if (!this.host) throw new Error('[Cards] host element not found');

        this.url = opts.url || ROUTES.components.cards.html;
        this.data = Array.isArray(opts.data) ? opts.data : (opts.data ? [opts.data] : []);
        this.variant = opts.variant || 'tile';
        this.templateId = opts.templateId || null;
        this.bindings = Array.isArray(opts.bindings) ? opts.bindings : [];
        this.gridClass = opts.gridClass || null;
        this.itemClass = opts.itemClass || null;
        this.onCardClick = typeof opts.onCardClick === 'function' ? opts.onCardClick : null;

        const cm = opts.contextMenu && typeof opts.contextMenu === 'object' ? opts.contextMenu : {};
        this.contextMenuCfg = {
            enable: !!cm.enable,
            pos: cm.pos || 'auto',
            actions: typeof cm.actions === 'function' ? cm.actions : null,
            opts: cm.opts || {}
        };

        this.root = null;
        this.$grid = null;
        this._ctxMenu = null;
        this._loaded = false;

        this._render();
    }

    async _loadMarkup() {
        if (this._loaded) return;
        const raw = await (await fetch(this.url + '?raw')).text();
        const tpl = stripScripts(raw);

        const wrapper = tpl.content.querySelector('[data-cards-root]').cloneNode(true);
        this.root = wrapper;
        this.$grid = this.root.querySelector('[data-cards-grid]');

        if (this.gridClass) {
            this.$grid.className = this.gridClass;
        }

        this._loaded = true;
    }

    _resolveTemplate() {
        if (this.templateId) {
            const el = document.querySelector(this.templateId);
            if (!el) throw new Error(`[Cards] templateId not found: ${this.templateId}`);
            return el;
        }
        const fallbackId = this.variant === 'block' ? '#tmpl-card-block' : '#tmpl-card-tile';
        const fromLib = document.querySelector(fallbackId);
        if (!fromLib) throw new Error(`[Cards] default template not found: ${fallbackId}`);
        return fromLib;
    }

    async _ensureContextMenu() {
        if (!this.contextMenuCfg.enable || this._ctxMenu) return;
        const { ContextMenu } = await import(ROUTES.components.contextMenu.js);
        this._ctxMenu = new ContextMenu(this.contextMenuCfg.opts || {});
        await this._ctxMenu.load();
    }

    _computeContextMenuPos(evt) {
        const { clientX: x, clientY: y } = evt;
        const midX = window.innerWidth / 2;
        const midY = window.innerHeight / 2;

        const horizontal = x > midX ? 'l' : 'r';
        const vertical = y > midY ? 't' : 'b';

        const pos = `${vertical}${horizontal}`;
        if (pos === 'br' || pos === 'tr' || pos === 'bl' || pos === 'tl') return pos;
        return 'br';
    }

    async _render() {
        await this._loadMarkup();
        this.host.innerHTML = '';
        this.host.appendChild(this.root);

        this.$grid.innerHTML = '';
        const tpl = this._resolveTemplate();

        const cards = this.data || [];
        for (let i = 0; i < cards.length; i++) {
            const item = cards[i];
            const node = tpl.content.cloneNode(true);
            const cardEl = node.querySelector('[data-card]') || node.firstElementChild;

            if (this.itemClass && cardEl) {
                cardEl.className = `${cardEl.className} ${this.itemClass}`.trim();
            }

            this.bindings.forEach(b => {
                const target = node.querySelector(b.selector);
                if (!target) return;
                const value = this._valueFromKey(item, b.key, b.transform);
                const mode = b.mode || 'text';
                if (mode === 'html') {
                    target.innerHTML = value ?? '';
                } else if (mode === 'attr' && b.attr) {
                    target.setAttribute(b.attr, value ?? '');
                } else {
                    target.textContent = value ?? '';
                }
            });

            if (this.onCardClick && cardEl) {
                cardEl.addEventListener('click', () => this.onCardClick(item, cardEl, i));
            }

            if (this.contextMenuCfg.enable && cardEl) {
                cardEl.addEventListener('contextmenu', async (ev) => {
                    ev.preventDefault();
                    await this._ensureContextMenu();

                    const actions = this.contextMenuCfg.actions
                        ? (this.contextMenuCfg.actions(item, cardEl, i) || [])
                        : [];

                    let pos = this.contextMenuCfg.pos === 'auto'
                        ? this._computeContextMenuPos(ev)
                        : this.contextMenuCfg.pos;

                    this._ctxMenu.open(ev.clientX, ev.clientY, actions, pos);
                });
            }

            this.$grid.appendChild(node);
        }
    }

    _valueFromKey(obj, key, transform) {
        if (!key) return '';
        const parts = String(key).split('.');
        let val = obj;
        for (const p of parts) {
            if (val == null) break;
            val = val[p];
        }
        return typeof transform === 'function' ? transform(val, obj) : val;
    }

    async setData(data) {
        this.data = Array.isArray(data) ? data : (data ? [data] : []);
        await this._render();
    }

    async setTemplate(templateIdOrVariant) {
        if (templateIdOrVariant.startsWith('#')) {
            this.templateId = templateIdOrVariant;
        } else {
            this.templateId = null;
            this.variant = templateIdOrVariant;
        }
        await this._render();
    }
}
