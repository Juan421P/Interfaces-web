import { Component } from './../../base/component.js';
import { ROUTES } from './../../../js/lib/routes.js';

export class Toast extends Component {
    constructor(opts = {}) {
        const containerId = opts.containerId || 'toast-container';
        const host = document.getElementById(containerId) || document.body;

        super({
            host: host,
            url: opts.url || ROUTES.components.overlay.toast.html
        });

        this.containerId = containerId;
        this.defaults = {
            dismissOnClick: true,
            url: null,
            ...opts.defaults
        };
        this.toastTemplate = null;
    }

    async _beforeRender() {
        await this.loadTemplate();
        this.ensureContainer();
    }

    async loadTemplate() {
        console.log('[Toast] Loading toast template from:', this.url);
        const template = await this._fetchTemplate();
        this.toastTemplate = template.content.querySelector('.toast');

        if (!this.toastTemplate) {
            console.error('[Toast] Toast template element not found!');
            this.toastTemplate = document.createElement('div');
            this.toastTemplate.className = 'toast';
            this.toastTemplate.innerHTML = `
                <span class="toast-message"></span>
                <div class="progress-bar"></div>
            `;
        }
    }

    ensureContainer() {
        console.log('[Toast] Ensuring container...');

        if (this.host.id === this.containerId) {
            this.container = this.host;
            return;
        }

        this.container = this.host.querySelector(`#${this.containerId}`);
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = this.containerId;
            this.container.className = 'fixed top-5 right-5 flex flex-col gap-2 max-w-sm z-[9999]';
            this.host.appendChild(this.container);
        }
    }

    async _render() {
        this.isRendered = true;
    }

    /**
     * @param {String} message
     * @param {Number} duration
     * @param {Object} opts
     */
    show(message, duration = 7500, opts = {}) {
        if (!this.isRendered) {
            console.error('[Toast] Toast not initialized. Call render() first.');
            return;
        }

        const { dismissOnClick, url } = { ...this.defaults, ...opts };
        const toast = this.toastTemplate.cloneNode(true);
        const messageSpan = toast.querySelector('.toast-message');

        if (!messageSpan) {
            console.error('[Toast] .toast-message not found in template');
            return;
        }

        messageSpan.textContent = message;
        toast.style.userSelect = 'none';
        toast.style.cursor = 'pointer';
        toast.style.animation = `toast-fade ${duration}ms ease-in-out forwards`;

        const progressBar = toast.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = '100%';
            progressBar.style.transition = `none`;

            requestAnimationFrame(() => {
                progressBar.offsetWidth;
                progressBar.style.transition = `width ${duration - 100}ms linear`;
                progressBar.style.width = '0%';
            });
        }

        toast.addEventListener('click', () => {
            if (url) window.location.href = url;
            if (dismissOnClick) toast.remove();
        });

        this.container.appendChild(toast);

        toast.addEventListener('animationend', (event) => {
            if (event.animationName === 'toast-fade') {
                toast.remove();
            }
        });
    }

    async init() {
        await this.render();
    }
}