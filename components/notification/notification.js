import { ROUTES } from './../../js/helpers/routes';

export class Notification {

    constructor(opts = {}) {
        this.data = opts.data;
        this.url = opts.url || ROUTES.components.notification.html;
    }

    async render() {
        const res = await fetch(this.url + '?raw');
        let template = await res.text();

        Object.entries(this.data).forEach(([k, v]) => {
            template = template.replaceAll(`{{${k}}}`, v);
        });

        const tmp = document.createElement('template');
        tmp.innerHTML = template.trim();

        const element = Array.from(tmp.content.children).find(n => n.tagName !== 'SCRIPT') || tmp.content.firstElementChild;

        return element.cloneNode(true);
    }


}