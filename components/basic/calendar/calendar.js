import { ROUTES } from '../../../js/lib/routes.js';
import { stripScripts } from './../../js/lib/index.js';
const { ContextMenu } = await import(ROUTES.components.contextMenu.js);

export class Calendar {
    constructor(opts = {}) {
        this.url = opts.url || ROUTES.components.calendar.html;
        this.host = opts.host;
        this.events = opts.events || [];
        this.onAdd = opts.onAdd || (() => { });
        this.onEdit = opts.onEdit || (() => { });
        this.onDelete = opts.onDelete || (() => { });
        this.currentDate = opts.currentDate || new Date();

        this.today = new Date();
        this.today.setHours(0, 0, 0, 0);

        this.container = null;
        this.contextMenu = new ContextMenu();
    }

    async load() {
        if (!this.host) throw new Error('Calendar host element is required');

        const markup = await (await fetch(this.url + '?raw')).text();
        const tpl = stripScripts(markup);

        this.host.innerHTML = '';
        const templateEl = tpl.content ? tpl : document.createElement('template');
        if (!tpl.content) templateEl.innerHTML = tpl;

        const cloned = templateEl.content.querySelector('#tmpl-calendar').content.cloneNode(true);
        this.host.appendChild(cloned);

        this.container = this.host.querySelector('.calendar-wrapper');

        this.host.querySelector('.calendar-prev')?.addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this._render();
        });

        this.host.querySelector('.calendar-next')?.addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this._render();
        });

        window.addEventListener('resize', () => this._render());

        this._render();
    }

    _render() {
        const monthLabel = this.host.querySelector('.calendar-month');
        const grid = this.host.querySelector('.calendar-grid');
        grid.innerHTML = '';

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        monthLabel.textContent = this.currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });

        const firstDay = new Date(year, month, 1).getDay();
        const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const days = [];
        for (let i = 0; i < adjustedFirstDay; i++) days.push(null);
        for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d));

        days.forEach(day => grid.appendChild(this._createDayCell(day)));
    }

    _createDayCell(day) {
        const cell = document.createElement('div');
        if (!day) {
            cell.className = 'invisible';
            return cell;
        }

        const dayStr = day.toISOString().split('T')[0];
        const isEventDay = this.events.some(e => e.date === dayStr);
        const event = this.events.find(e => e.date === dayStr);
        const isLargeScreen = window.innerWidth >= 1024;

        cell.className = 'flex flex-col items-center justify-center p-2 transition-all transform rounded-lg cursor-pointer select-none hover:scale-105';
        if (isLargeScreen) {
            cell.classList.add('h-24');
        } else {
            cell.classList.add('h-16', 'aspect-square');
        }

        const dateSpan = document.createElement('span');
        dateSpan.textContent = day.getDate();
        dateSpan.className = 'text-sm font-semibold select-none sm:text-base drop-shadow';

        if (isEventDay) {
            cell.classList.add('bg-gradient-to-tr', 'from-indigo-400', 'to-blue-400', 'text-white');
            if (isLargeScreen) {
                const eventSpan = document.createElement('span');
                eventSpan.textContent =
                    event.name.length > 8 ? event.name.slice(0, 8) + '…' : event.name;
                eventSpan.className =
                    'mt-1 text-xs font-medium text-transparent bg-gradient-to-r from-indigo-100 to-blue-100 bg-clip-text drop-shadow';
                cell.appendChild(dateSpan);
                cell.appendChild(eventSpan);
            } else {
                cell.appendChild(dateSpan);
            }
        } else {
            dateSpan.classList.add(
                'bg-gradient-to-r',
                'from-indigo-400',
                'to-blue-400',
                'bg-clip-text',
                'text-transparent'
            );
            cell.classList.add(
                'hover:bg-indigo-200',
                'transition-colors',
                'duration-200'
            );
            cell.appendChild(dateSpan);
        }

        cell.addEventListener('click', e => this._handleCellClick(e, day, isEventDay, event));
        return cell;
    }

    _handleCellClick(e, day, isEventDay, event) {
        this.contextMenu.close();

        const canEdit = day >= this.today;
        const actions = [];

        if (canEdit) {
            actions.push({
                label: 'Agregar evento',
                className: 'hover:bg-indigo-50 text-indigo-500 font-medium',
                onClick: () => this.onAdd(day)
            });
        }

        if (isEventDay) {
            actions.push(
                {
                    label: 'Editar',
                    className: 'hover:bg-indigo-50 text-indigo-500 font-medium',
                    disabled: !canEdit,
                    onClick: () => this.onEdit(day, event)
                },
                {
                    label: 'Eliminar',
                    className: 'hover:bg-red-50 text-red-500 font-medium',
                    disabled: !canEdit,
                    onClick: () => this.onDelete(day, event)
                }
            );
        }

        if (actions.length) {
            this.contextMenu.open(e.clientX + 5, e.clientY + window.scrollY + 5, actions);
        }
    }
}