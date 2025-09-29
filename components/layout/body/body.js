import { Component } from './../../base/component.js';
import { ComponentRenderError } from './../../../js/errors/components/base/component-render-error.js';

export class Body extends Component {
	static getTemplate() {
		return `
  		<body id="body" class="relative flex justify-center min-h-screen mb-1 md:justify-start bg-gradient-to-tr from-[rgb(var(--body-from))] to-[rgb(var(--body-to))]">
			<!-- <div class="fixed bottom-10 left-0 w-[600px] h-[600px] rounded-full z-[-20] pointer-events-none  bg-gradient-to-tr from-indigo-400 to-blue-400 opacity-60 translate-x-[-50%] translate-y-[50%] animate-left-spin-pulse">
			</div>
    		<div class="fixed top-0 right-0 w-[300px] h-[300px] rounded-full z-[-20] pointer-events-none  bg-gradient-to-tl from-blue-400 to-indigo-400 opacity-40 translate-x-[50%] translate-y-[-50%] animate-right-spin-pulse">
			</div> -->
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
	}

	constructor(opts = {}) {
		super({
			host: document.body,
			autoRender: false
		});
		this.content = opts.content || '';
		this.afterLoad = opts.afterLoad || null;
		this.mainSelector = opts.mainSelector || '#main-view';
		this.originalBodyHTML = document.body.innerHTML;
	}

	async _beforeRender() { this.originalBodyClasses = document.body.className; }

	async _render() {
		try {
			const t = document.createElement('template');
			t.innerHTML = Body.getTemplate();
			const tmpl = t.content.querySelector('#tmpl-body');
			const bodyEl = tmpl.content.firstElementChild;

			if (!bodyEl) throw new ComponentRenderError(this.constructor.name, 'template fetching', new Error('Failed to load body template'));

			document.body.outerHTML = bodyEl.outerHTML;
			this.host = document.body;

			await new Promise(resolve => {
				if (document.readyState === 'loading') {
					document.addEventListener('DOMContentLoaded', resolve);
				} else {
					setTimeout(resolve, 0);
				}
			});

			if (this.originalBodyClasses) {
				document.body.className += ' ' + this.originalBodyClasses;
			}

			if (this.content) {
				await this._injectContent();
			}
		} catch (error) {
			throw new ComponentRenderError(this.constructor.name, 'body replacement', error);
		}
	}

	async _afterRender() {
		if (typeof this.afterLoad === 'function') {
			try { await this.afterLoad(); } catch (e) { console.error('[Body] afterLoad callback failed:', e); }
		}
	}

	async _injectContent() {
		const mainElement = document.querySelector(this.mainSelector);
		if (mainElement) mainElement.innerHTML = this.content;
		else console.warn(`[Body] Main content area not found with selector: ${this.mainSelector}`);
	}

	async setContent(content, selector = null) {
		this.content = content;
		const sel = selector || this.mainSelector;
		const el = document.querySelector(sel);
		if (el) el.innerHTML = content;
		else throw new ComponentRenderError(this.constructor.name, 'content injection', new Error(`Content area not found: ${sel}`));
	}

	async appendContent(content, selector = null) {
		const sel = selector || this.mainSelector;
		const el = document.querySelector(sel);
		if (el) el.innerHTML += content;
		else throw new ComponentRenderError(this.constructor.name, 'content appending', new Error(`Content area not found: ${sel}`));
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
		} catch (error) {
			throw new ComponentRenderError(this.constructor.name, 'body restoration', error);
		}
	}

	getMainElement() { return document.querySelector(this.mainSelector); }
	hasMainElement() { return !!document.querySelector(this.mainSelector); }

	async destroy() { await this.restore(); await super.destroy(); }

	_getFallbackTemplate() {
		const template = document.createElement('template');
		template.innerHTML = Body.getTemplate().replace('<template id="tmpl-body">', '').replace('</template>', '');
		return template;
	}
}