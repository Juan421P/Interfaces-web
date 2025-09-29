import { Component } from './../../components.js';

export class Toast extends Component {

	static getTemplate() {
		return `
			<div class="toast relative pointer-events-auto bg-gradient-to-r from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] text-[rgb(var(--button-text))] px-5 py-5 rounded shadow-lg text-md overflow-hidden max-w-sm min-w-[200px]">
  				<span class="toast-message text-shadow"></span>
  				<div class="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[rgb(var(--off-from))] to-[rgb(var(--off-to))] progress-bar">
				</div>
			</div>
			`;
	}

	constructor(opts = {}) {
		const containerId = opts.containerId || 'toast-container';
		const host = document.getElementById(containerId) || document.body;

		super({
			host: host,
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
		const t = document.createElement('template');
		t.innerHTML = Toast.getTemplate().trim();
		this.toastTemplate = t.content.firstElementChild;

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
				// force reflow
				progressBar.offsetWidth; // eslint-disable-line no-unused-expressions
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
