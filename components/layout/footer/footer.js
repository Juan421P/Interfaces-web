import { Component } from './../../base/component.js';
import { ROUTES } from './../../../js/lib/routes.js';
import { stripScripts } from './../../../js/lib/common.js';

export class Footer extends Component {

    constructor(selector = '#footer', url = ROUTES.components.layout.footer.html) {
        super({ host: document.createElement('div'), url, autoRender: false });

        this.selector = selector;
        this.url = url;
        this.footerElement = null;
        this.onScroll = this.onScroll.bind(this);
        this._load();
    }

    async _load() {
        try {
            const res = await fetch(this.url + '?raw');
            const html = await res.text();

            const cleanHTML = stripScripts(html).innerHTML;

            const oldFooter = document.querySelector(this.selector);
            if (!oldFooter) throw new Error(`Element ${this.selector} not found`);

            oldFooter.outerHTML = cleanHTML;
            this.footerElement = document.querySelector(this.selector);
            if (!this.footerElement) {
                throw new Error(`New ${this.selector} element not found after replacing HTML`);
            }

            this.attachListeners();
        } catch (error) {
            console.error('Footer failed to load :(', error);
        }
    }

    attachListeners() {
        window.addEventListener('scroll', this.onScroll);
        this.onScroll();
        this.footerElement.addEventListener('click', () => {
            this.footerElement.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
            this.footerElement.classList.add('opacity-0', 'pointer-events-none', 'translate-y-full');
        });
    }

    onScroll() {
        const scrollY = window.scrollY;
        const visibleHeight = window.innerHeight;
        const pageHeight = document.documentElement.scrollHeight;
        const atBottom = pageHeight - (scrollY + visibleHeight) <= 1;

        if (atBottom) {
            this.footerElement.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-full');
            this.footerElement.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
        } else {
            this.footerElement.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
            this.footerElement.classList.add('opacity-0', 'pointer-events-none', 'translate-y-full');
        }
    }

    async render() {
    }

}