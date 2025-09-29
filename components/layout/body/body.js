import { Component } from './../../base/component.js';
import { ComponentRenderError } from './../../../js/errors/components/base/component-render-error.js';

export class Body extends Component {
	constructor(opts = {}) {
		super({
			host: document.body,
			autoRender: false
		});
		this.content = opts.content || '';
		this.afterLoad = opts.afterLoad || null;
		this.mainSelector = opts.mainSelector || '#main-view';
		this.originalBodyHTML = document.body.innerHTML;
		this.originalBodyClasses = document.body.className;
	}

	async _render() {
		try {
			console.log('🔧 [Body] Starting render...');

			const bodyHTML = `
			<body class="relative flex justify-center min-h-screen mb-1 md:justify-start bg-gradient-to-tr from-[rgb(var(--body-from))] to-[rgb(var(--body-to))]">
    			<div class="fixed bottom-10 left-0 w-[600px] h-[600px] z-[50] pointer-events-none animate-left-spin-pulse">
        			<div class="absolute inset-0 border-2 border-[rgb(var(--button-to))] opacity-20"></div>
        			<div class="absolute border-2 border-[rgb(var(--placeholder-to))] inset-1 opacity-5"></div>
        			<div class="absolute inset-0 rotate-45 border-2 border-[rgb(var(--button-from))] opacity-40"></div>
        			<div class="absolute rotate-45 border-2 border-[rgb(var(--placeholder-from))] inset-1 opacity-20"></div>
    			</div>
    			<div class="fixed top-0 right-0 w-[300px] h-[300px] z-[-20] pointer-events-none animate-right-spin-pulse">
        			<div class="absolute inset-0 border-2 border-[rgb(var(--button-to))] opacity-20"></div>
        			<div class="absolute border-2 border-[rgb(var(--placeholder-to))] inset-1 opacity-5"></div>
        			<div class="absolute inset-0 rotate-45 border-2 border-[rgb(var(--button-from))] opacity-40"></div>
        			<div class="absolute rotate-45 border-2 border-[rgb(var(--placeholder-from))] inset-1 opacity-20"></div>
    			</div>
    			<div id="navbar"></div>
    			<div id="main-view" class="flex-1 w-full"></div>
    			<footer id="footer"></footer>
			</body>
			`;

			console.log('🔧 [Body] Replacing body outerHTML...');

			document.body.outerHTML = bodyHTML;

			this.host = document.body;

			console.log('🔧 [Body] Body replaced, checking elements...');
			console.log('🔧 [Body] #navbar exists:', !!document.querySelector('#navbar'));
			console.log('🔧 [Body] #main-view exists:', !!document.querySelector('#main-view'));
			console.log('🔧 [Body] #footer exists:', !!document.querySelector('#footer'));

			await new Promise(resolve => setTimeout(resolve, 50));

			if (this.content) {
				await this._injectContent();
			}

			if (typeof this.afterLoad === 'function') {
				try {
					await this.afterLoad();
				} catch (e) {
					console.error('[Body] afterLoad callback failed:', e);
				}
			}

			console.log('🔧 [Body] Render completed successfully');

		} catch (error) {
			console.error('🔧 [Body] Render error:', error);
			throw new ComponentRenderError(this.constructor.name, 'body replacement', error);
		}
	}

	async _injectContent() {
		const mainElement = document.querySelector(this.mainSelector);
		if (mainElement) {
			mainElement.innerHTML = this.content;
			console.log('🔧 [Body] Content injected into', this.mainSelector);
		} else {
			console.warn(`[Body] Main content area not found with selector: ${this.mainSelector}`);
		}
	}

	async setContent(content, selector = null) {
		this.content = content;
		const sel = selector || this.mainSelector;
		const el = document.querySelector(sel);
		if (el) {
			el.innerHTML = content;
		} else {
			throw new ComponentRenderError(this.constructor.name, 'content injection', new Error(`Content area not found: ${sel}`));
		}
	}

	async appendContent(content, selector = null) {
		const sel = selector || this.mainSelector;
		const el = document.querySelector(sel);
		if (el) {
			el.innerHTML += content;
		} else {
			throw new ComponentRenderError(this.constructor.name, 'content appending', new Error(`Content area not found: ${sel}`));
		}
	}

	async clearContent(selector = null) {
		const sel = selector || this.mainSelector;
		const el = document.querySelector(sel);
		if (el) el.innerHTML = '';
	}

	async restore() {
		try {
			document.body.outerHTML = this.originalBodyHTML;
			this.host = document.body;
			if (this.originalBodyClasses) {
				document.body.className = this.originalBodyClasses;
			}
		} catch (error) {
			throw new ComponentRenderError(this.constructor.name, 'body restoration', error);
		}
	}

	getMainElement() {
		return document.querySelector(this.mainSelector);
	}

	hasMainElement() {
		return !!document.querySelector(this.mainSelector);
	}

	async destroy() {
		await this.restore();
		await super.destroy();
	}
}