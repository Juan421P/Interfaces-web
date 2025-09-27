import { ROUTES } from '../../../js/lib/routes.js';
import { stripScripts } from '../../../js/lib/common.js';

export class ContextMenu {
    constructor(opts = {}) {
        this.url = opts.url || ROUTES.components.contextMenu.html;
        this.actions = opts.actions || [];
        this.menu = null;
        this.isOpen = false;

        this._handleOutsideClick = this._handleOutsideClick.bind(this);
    }

    async load() {
        if (this.menu) return;
        const markup = await (await fetch(this.url + '?raw')).text();
        const tpl = stripScripts(markup);

        const templateEl = tpl.content ? tpl : document.createElement('template');
        if (!tpl.content) templateEl.innerHTML = tpl;

        const cloned = templateEl.content.querySelector('#tmpl-context-menu').content.cloneNode(true);
        document.body.appendChild(cloned);

        this.menu = document.querySelector('#context-menu');
    }

    /**
     * Muestra (abre) el context menu en las coordenadas especificadas, con las acciones especificadas
     * @param {Number} x - Coordenadas en x (posición horizontal) relativa al viewport
     * @param {Number} y - Lo mismo que el anterior pero coordenadas en y (posición vertical)
     * @param {Array<>} [actions = []] - Un array que contiene las opciones que ha de contener el context-menu. Puede incluir el estilo de cada acción por separado
     * @param {'br'|'tr'|'bl'|'tl'} [pos = 'br'] - La posición en la que ha de mostrarse el context-menu en relación a las coordenadas:
     * - 'br': Abajo a la derecha del punto (x,y) (valor por defecto)
     * - 'tr': Arriba a la derecha del punto (x,y)
     * - 'bl': Abajo a la izquierda del punto (x,y)
     * - 'tl': Arriba a la izquierda del punto (x,y)
     * 
     * @example
     * contextMenu.open(
     * 300, 400, [
     *  { label: 'Opción 1', onClick: () => {} },
     *  { label: 'Opción 2', onClick: () => {} }
     * ], 'tl')
     * 
     */
    async open(x, y, actions = [], pos = 'br') {
        if (pos != 'br' && pos != 'tr' && pos != 'bl' && pos != 'tl') pos = 'br';

        await this.load();
        this.close();

        this.menu.innerHTML = '';

        actions.forEach(action => {
            const btn = document.createElement('button');
            btn.textContent = action.label;
            btn.className = `block cursor-pointer w-full text-left px-3 py-1 rounded transition-colors hover:bg-[rgb(var(--card-from))] hover:text-[rgb(var(--text-from))] ${action.className || ''}`;
            if (action.disabled) {
                btn.disabled = true;
                btn.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                btn.addEventListener('click', () => {
                    this.close();
                    action.onClick?.();
                });
            }
            this.menu.appendChild(btn);
        });

        this.menu.classList.remove('hidden');
        const menuRect = this.menu.getBoundingClientRect();
        const menuWidth = menuRect.width;
        const menuHeight = menuRect.height;

        this.menu.style.top = '';
        this.menu.style.left = '';
        this.menu.style.bottom = '';
        this.menu.style.right = '';

        switch (pos) {
            case 'br':
                this.menu.style.top = `${y}px`;
                this.menu.style.left = `${x}px`;
                break;
            case 'tr':
                this.menu.style.bottom = `${window.innerHeight - y}px`;
                this.menu.style.left = `${x}px`;
                break;
            case 'bl':
                this.menu.style.top = `${y}px`;
                this.menu.style.right = `${window.innerWidth - x}px`;
                break;
            case 'tl':
                this.menu.style.bottom = `${window.innerHeight - y}px`;
                this.menu.style.right = `${window.innerWidth - x}px`;
                break;
        }

        const finalRect = this.menu.getBoundingClientRect();

        if (finalRect.right > window.innerWidth) {
            this.menu.style.left = `${window.innerWidth - menuWidth}px`;
            this.menu.style.right = '';
        }
        if (finalRect.bottom > window.innerHeight) {
            this.menu.style.top = `${window.innerHeight - menuHeight}px`;
            this.menu.style.bottom = '';
        }
        if (finalRect.left < 0) {
            this.menu.style.left = '0px';
            this.menu.style.right = '';
        }
        if (finalRect.top < 0) {
            this.menu.style.top = '0px';
            this.menu.style.bottom = '';
        }

        this.isOpen = true;
        document.addEventListener('click', this._handleOutsideClick, true);
    }

    close() {
        if (!this.menu) return;
        this.menu.classList.add('hidden');
        this.isOpen = false;
        document.removeEventListener('click', this._handleOutsideClick, true);
    }

    _handleOutsideClick(e) {
        if (!this.menu.contains(e.target)) {
            this.close();
        }
    }
}