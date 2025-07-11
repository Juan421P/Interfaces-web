import { ROUTES } from './../../js/helpers/routes.js';
import { stripScripts } from './../../js/helpers/common-methods.js';

export class Body {

    /**
    *   @param {Object} opts
    *   @param {string} [opts.url]
    *   @param {string} [opts.content]
    *   @param {Function} [opts.afterLoad]
    */
    constructor(opts = {}) {
        this.url = opts.url || ROUTES.components.body.html;
        this.content = opts.content || '';
        this.afterLoad = opts.afterLoad || null;
    }

    async load() {
        try {
            const res = await fetch(this.url + '?raw');
            if (!res.ok) throw new Error(`Cannot fetch ${this.url} :(`);

            document.body.outerHTML = await res.text();

            if (this.content) {
                const main = document.querySelector('#main');
                if (main) main.innerHTML = this.content;
            }

            if (typeof this.afterLoad === 'function') {
                this.afterLoad();
            }
        } catch (error) {
            console.error('Body component failed :(', error);
        }
    }
    
}