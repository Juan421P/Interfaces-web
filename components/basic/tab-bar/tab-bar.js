import { ROUTES } from '../../../js/lib/routes.js';
import { stripScripts } from '../../js/lib/index.js';

export class TabBar {
    /**
     * @param {Object} opts
     * @param {string|HTMLElement} opts.host
     * @param {Array} opts.tabs
     * @param {string} [opts.activeId]
     * @param {string} [opts.url]
     * @param {string} [opts.activeClass]
     */
    constructor(opts = {}) {
        if (!opts.host) throw new Error('[TabBar]', 'TabBar requires a host element');
        if (!opts.tabs || !opts.tabs.length) throw new Error('TabBar requires a tabs array');

        this.host = typeof opts.host === 'string' ? document.querySelector(opts.host) : opts.host;
        this.tabs = opts.tabs;
        this.activeId = opts.activeId || this.tabs[0].id;
        this.url = opts.url || ROUTES.components.tabBar.html;
        this.activeClass = opts.activeClass || 'bg-[rgb(var(--card-from))]';

        this.render();
    }

    async render() {
        try {
            const response = await fetch(this.url + '?raw');
            const html = await response.text();
            const template = stripScripts(html);

            const wrapper = template.content.firstElementChild.cloneNode(true);
            const baseBtn = wrapper.querySelector('button');
            baseBtn.remove();

            this.tabs.forEach(tab => {
                const btn = baseBtn.cloneNode(true);
                btn.dataset.tab = tab.id;
                btn.querySelector('span').textContent = tab.label;

                btn.addEventListener('click', () => this._activateTab(tab));

                if (tab.id === this.activeId) btn.classList.add(this.activeClass);
                wrapper.appendChild(btn);
            });

            this.host.innerHTML = '';
            this.host.appendChild(wrapper);

            const defaultTab = this.tabs.find(t => t.id === this.activeId);
            if (defaultTab) this._activateTab(defaultTab, true);

        } catch (error) {
            console.error('[TabBar]', 'TabBar render failed :(', error);
        }
    }

    _activateTab(tab, skipClick = false) {
        this.host.querySelectorAll('[data-tab]').forEach(b => b.classList.remove(this.activeClass));

        const btn = this.host.querySelector(`[data-tab="${tab.id}"]`);
        if (btn) btn.classList.add(this.activeClass);

        if (tab.targetSelector) {
            this.tabs.forEach(t => {
                if (!t.targetSelector) return;
                const el = document.querySelector(t.targetSelector);
                if (el) el.classList.toggle('hidden', t.id !== tab.id);
            });
        }

        if (!skipClick && typeof tab.onClick === 'function') {
            tab.onClick(tab.id);
        }
    }
}