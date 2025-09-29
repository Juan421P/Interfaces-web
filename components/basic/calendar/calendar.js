import { Component } from './../../base/component.js';
import { ContextMenu } from './../../overlay/context-menu/context-menu.js';
// const { ContextMenu } = await import(ROUTES.components.contextMenu.js); 

export class Calendar extends Component {

	static getTemplate() {
		return `
<template id="tmpl-calendar">
  <div class="flex flex-col w-full gap-6 mx-auto select-none calendar-wrapper max-w-7xl">

    <div class="flex items-center justify-between">
      <button
        class="calendar-prev px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow hover:scale-105 transition-transform select-none">
        ◀
      </button>
      <h2
        class="calendar-month text-xl font-semibold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow capitalize">
      </h2>
      <button
        class="calendar-next px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow hover:scale-105 transition-transform select-none">
        ▶
      </button>
    </div>

    <div class="grid grid-cols-7 gap-2 text-center">
      <div class="font-semibold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow">Lun</div>
      <div class="font-semibold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow">Mar</div>
      <div class="font-semibold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow">Mié</div>
      <div class="font-semibold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow">Jue</div>
      <div class="font-semibold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow">Vie</div>
      <div class="font-semibold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow">Sáb</div>
      <div class="font-semibold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow">Dom</div>
    </div>

    <div class="calendar-grid grid grid-cols-7 gap-2 min-h-[60vh]"></div>
  </div>
</template>
`;
	}

	constructor(opts = {}) {
		if (!opts.host) throw new Error('Calendar requires a host element');
		const host = typeof opts.host === 'string' ? document.querySelector(opts.host) : opts.host;
		if (!host) throw new Error('Calendar host element not found');

		// ❌ antes: this.url = opts.url || ROUTES.components.calendar.html;
		super({ host });

		this.events = opts.events || [];
		this.onAdd = opts.onAdd || (() => { });
		this.onEdit = opts.onEdit || (() => { });
		this.onDelete = opts.onDelete || (() => { });
		this.currentDate = opts.currentDate || new Date();

		this.today = new Date(); this.today.setHours(0, 0, 0, 0);

		this.container = null;
		this.contextMenu = new ContextMenu();

		this.load();
	}

	async load() {
		// ✅ montar desde el template embebido
		const t = document.createElement('template');
		t.innerHTML = Calendar.getTemplate();
		const tmpl = t.content.querySelector('#tmpl-calendar');
		const cloned = tmpl.content.cloneNode(true);

		this.host.innerHTML = '';
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
		if (!grid) return;

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
		if (!day) { cell.className = 'invisible'; return cell; }

		const dayStr = day.toISOString().split('T')[0];
		const isEventDay = this.events.some(e => e.date === dayStr);
		const event = this.events.find(e => e.date === dayStr);
		const isLargeScreen = window.innerWidth >= 1024;

		cell.className = 'flex flex-col items-center justify-center p-2 transition-all transform rounded-lg cursor-pointer select-none hover:scale-105';
		cell.classList.add(isLargeScreen ? 'h-24' : 'h-16', ...(isLargeScreen ? [] : ['aspect-square']));

		const dateSpan = document.createElement('span');
		dateSpan.textContent = day.getDate();
		dateSpan.className = 'text-sm font-semibold select-none sm:text-base drop-shadow';

		if (isEventDay) {
			cell.classList.add('bg-gradient-to-tr', 'from-indigo-400', 'to-blue-400', 'text-white');
			if (isLargeScreen) {
				const eventSpan = document.createElement('span');
				eventSpan.textContent = event.name.length > 8 ? event.name.slice(0, 8) + '…' : event.name;
				eventSpan.className = 'mt-1 text-xs font-medium text-transparent bg-gradient-to-r from-indigo-100 to-blue-100 bg-clip-text drop-shadow';
				cell.append(dateSpan, eventSpan);
			} else {
				cell.appendChild(dateSpan);
			}
		} else {
			dateSpan.classList.add('bg-gradient-to-r', 'from-[rgb(var(--text-from))]', 'to-[rgb(var(--text-to))]', 'bg-clip-text', 'text-transparent');
			cell.classList.add('hover:bg-indigo-200', 'transition-colors', 'duration-200');
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
