export class Toast {

    /**
    *   @param {string} containerId
    *   @param {Object} [defaults]
    *   defaults.dismissOnClick {Boolean} default = true
    *   defaults.url {String|null}
    */
    constructor(containerId = 'toast-container', defaults = {}) {
        this.containerId = containerId;
        this.toastHtmlUrl = '../components/toast/toast.html';
        this.defaults = {
            dismissOnClick: true,
            url: null,
            ...defaults
        };
        this.container = null;
        this.toastTemplate = null;
    }

    async loadTemplate() {
        console.log('[Toast] Loading toast template from:', this.toastHtmlUrl);
        const res = await fetch(this.toastHtmlUrl);
        if (!res.ok) throw new Error('[Toast] Failed to fetch toast HTML');
        const html = await res.text();
        const template = document.createElement('template');
        template.innerHTML = html.trim();
        this.toastTemplate = template.content.firstElementChild;
        if (!this.toastTemplate) {
            console.error('[Toast] Toast template is null!');
        } else {
            console.log('[Toast] Toast template loaded successfully.');
        }
    }


    ensureContainer() {
        console.log('[Toast] Ensuring container...');
        this.container = document.getElementById(this.containerId);
        if (this.container) {
            console.log(`[Toast] Container #${this.containerId} already exists`);
            return;
        }
        console.log(`[Toast] Container #${this.containerId} not found. Creating it.`);
        this.container = document.createElement('div');
        this.container.id = this.containerId;
        this.container.classList.add('fixed', 'top-5', 'right-5', 'flex', 'flex-col', 'gap-2', 'max-w-xs', 'z-[9999]');
        document.body.appendChild(this.container);
        const verified = document.getElementById(this.containerId);
        if (!verified) {
            console.error('[Toast] Failed to append container to document body.');
        } else {
            console.log('[Toast] Container appended successfully.');
        }
    }

    async init() {
        await this.loadTemplate();
        this.ensureContainer();
    }

    /**
    *   @param {String}  message
    *   @param {Number}  duration – ms
    *   @param {Object}  opts – per-toast overrides
    *   opts.dismissOnClick {Boolean}
    *   opts.url {String|null}
    */
    show(message, duration = 7500, opts = {}) {
        const { dismissOnClick, url } = { ...this.defaults, ...opts };
        const toast = this.toastTemplate.cloneNode(true);
        toast.querySelector('.toast-message').textContent = message;
        toast.style.userSelect = 'none';
        toast.style.cursor = 'pointer';
        toast.style.animation = `toast-fade ${duration}ms ease-in-out forwards`;
        const progressBar = toast.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = '100%';
            progressBar.style.transition = `width ${duration}ms linear`;
            requestAnimationFrame(() => (progressBar.style.width = '0%'));
        }
        toast.addEventListener('click', () => {
            if (url) window.location.href = url;
            if (dismissOnClick) toast.remove();
        });
        this.container.appendChild(toast);
        const autoRemove = setTimeout(() => toast.remove(), duration);
        toast.addEventListener('transitionend', () => clearTimeout(autoRemove));
    }

}