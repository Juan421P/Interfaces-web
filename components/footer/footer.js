import { ROUTES } from "./../../js/helpers/routes";
import { stripScripts } from './../../js/helpers/common-methods.js';

export class Footer {
    constructor(selector = '#footer', url = ROUTES.components.footer.html) {
        this.selector = selector;
        this.url = url;
        this.footerElement = null;
        this.onScroll = this.onScroll.bind(this);
    }

    async load() {
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
}