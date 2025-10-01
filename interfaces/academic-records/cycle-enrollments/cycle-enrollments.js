import { Interface } from './../../interfaces.js';
import { StudentCycleEnrollmentsService } from './../../../js/services/student-cycle-enrollments.service.js';
import { Modal } from './../../../components/overlay/modal/modal.js';

export default class StudentCycleEnrollmentsInterface extends Interface {

  static getTemplate() {
    return `
<main class="flex flex-col min-h-screen p-10 md:ml-80">

  <h1
    class="text-2xl font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow select-none mb-10 py-3">
    Inscripciones a Ciclos
  </h1>

  <div class="flex flex-col mb-10 lg:flex-row lg:items-end lg:gap-6">
    <div class="flex flex-col flex-1 mb-4 lg:mb-0">
      <label class="mb-1 text-xs font-semibold text-indigo-400 select-none">Ciclo</label>
      <select id="filter-cycle"
        class="bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-4 py-3 rounded-lg text-indigo-500 shadow-md focus:outline-none">
        <option value="">Todos</option>
      </select>
    </div>

    <div class="flex flex-col flex-1 mb-4 lg:mb-0">
      <label class="mb-1 text-xs font-semibold text-indigo-400 select-none">Año</label>
      <select id="filter-year"
        class="bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-4 py-3 rounded-lg text-indigo-500 shadow-md focus:outline-none">
        <option value="">Todos</option>
      </select>
    </div>

    <div class="flex flex-col flex-1 mb-4 lg:mb-0">
      <label class="mb-1 text-xs font-semibold text-indigo-400 select-none">Estado</label>
      <select id="filter-status"
        class="bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-4 py-3 rounded-lg text-indigo-500 shadow-md focus:outline-none">
        <option value="">Todos</option>
        <option value="Activo">Activo</option>
        <option value="Finalizado">Finalizado</option>
        <option value="Retirado">Retirado</option>
      </select>
    </div>

    <div class="flex flex-col flex-1">
      <label class="mb-1 text-xs font-semibold text-indigo-400 select-none">Buscar estudiante</label>
      <input id="filter-student" type="text" placeholder="ID de inscripción o registro"
        class="bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-4 py-3 rounded-lg text-indigo-500 shadow-md focus:outline-none placeholder:text-indigo-300 placeholder:italic">
    </div>

    <div class="block transition-shadow duration-300 bg-transparent group rounded-xl hover:bg-white hover:shadow-lg">
      <button id="search-cycle-enrollments-btn" type="button"
        class="flex items-center gap-5 px-5 py-4 text-indigo-400 transition-colors duration-300 rounded-lg group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-blue-400">
        <svg xmlns="http://www.w3.org/2000/svg"
          class="flex-shrink-0 w-6 h-6 text-indigo-400 transition-colors duration-300 stroke-current group-hover:text-white drop-shadow fill-none"
          viewBox="0 0 24 24" stroke-width="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <span
          class="hidden pr-1 font-medium transition-all duration-300 select-none lg:block group-hover:text-white drop-shadow">Buscar</span>
      </button>
    </div>
  </div>

  <div id="cycle-enrollments-container" class="flex flex-col gap-8"></div>
</main>

<template id="tmpl-cycle-enrollment-card">
  <div class="bg-gradient-to-br from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
    <div class="flex items-start justify-between">
      <div>
        <h2 id="student-name"
            class="text-lg font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow select-none">
        </h2>
        <p id="cycle-info" class="text-xs font-semibold text-indigo-400"></p>
      </div>
      <button type="button" id="view-cycle-enrollment-btn" title="Ver detalles">
        <svg xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5 text-indigo-400 transition-all hover:text-indigo-500 hover:scale-110" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="5" r="1" />
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="19" r="1" />
        </svg>
      </button>
    </div>

    <div class="mt-2 text-sm text-indigo-600">
      <p><span class="font-semibold">Estado:</span> <span id="status"></span></p>
      <p><span class="font-semibold">Registrado:</span> <span id="registered-at"></span></p>
      <p><span class="font-semibold">Completado:</span> <span id="completed-at"></span></p>
    </div>
  </div>
</template>

<template id="tmpl-cycle-enrollment-detail">
  <div class="p-6">
    <h2 id="detail-student"
        class="text-xl font-bold bg-gradient-to-r from-[rgb(var(--body-from))]0 to-[rgb(var(--body-to))]0 bg-clip-text text-transparent drop-shadow select-none mb-2">
    </h2>
    <p id="detail-cycle-info" class="mb-4 text-sm font-semibold text-indigo-400"></p>

    <div class="mb-4 text-sm text-indigo-600">
      <p><span class="font-semibold">Estado:</span> <span id="detail-status"></span></p>
      <p><span class="font-semibold">Registrado:</span> <span id="detail-registered-at"></span></p>
      <p><span class="font-semibold">Completado:</span> <span id="detail-completed-at"></span></p>
    </div>
  </div>
</template>
    `;
  }

  async init() {
    this._all = await StudentCycleEnrollmentsService.getAll();

    // listeners del Service base
    this._onServiceEvent = async () => {
      this._all = await StudentCycleEnrollmentsService.getAll();
      this._populateFilters(this._all);
      this._applyFilters();
    };
    document.addEventListener('StudentCycleEnrollmentsService:post', this._onServiceEvent);
    document.addEventListener('StudentCycleEnrollmentsService:put', this._onServiceEvent);
    document.addEventListener('StudentCycleEnrollmentsService:delete', this._onServiceEvent);

    this._bindUI();
    this._populateFilters(this._all);
    this._renderList(this._all);
  }

  _bindUI() {
    const btn = document.getElementById('search-cycle-enrollments-btn');
    if (btn) btn.addEventListener('click', () => this._applyFilters());
  }

  _populateFilters(items) {
    // ciclo (yearcycle)
    const cycleSel = document.getElementById('filter-cycle');
    if (cycleSel) {
      const selVal = cycleSel.value;
      cycleSel.innerHTML = `<option value="">Todos</option>`;
      const cycles = [...new Set(items.map(x => x.yearcycle).filter(Boolean))];
      cycles.forEach(c =>
        cycleSel.insertAdjacentHTML('beforeend', `<option value="${String(c)}">${String(c)}</option>`)
      );
      if (cycles.includes(selVal)) cycleSel.value = selVal;
    }

    // año (derivado de registeredAt)
    const yearSel = document.getElementById('filter-year');
    if (yearSel) {
      const selVal = yearSel.value;
      yearSel.innerHTML = `<option value="">Todos</option>`;
      const years = [...new Set(items
        .map(x => this._yearOf(x.registeredAt))
        .filter(y => Number.isFinite(y)))].sort((a,b)=>a-b);
      years.forEach(y =>
        yearSel.insertAdjacentHTML('beforeend', `<option value="${y}">${y}</option>`)
      );
      if (years.map(String).includes(selVal)) yearSel.value = selVal;
    }
  }

  _applyFilters() {
    const cycle = (document.getElementById('filter-cycle')?.value || '').trim();
    const year  = (document.getElementById('filter-year')?.value || '').trim();
    const status = (document.getElementById('filter-status')?.value || '').trim();
    const q = (document.getElementById('filter-student')?.value || '').trim().toLowerCase();

    let list = this._all.slice();

    if (cycle) list = list.filter(x => String(x.yearcycle) === cycle);
    if (year)  list = list.filter(x => String(this._yearOf(x.registeredAt)) === year);
    if (status) list = list.filter(x => String(x.status) === status);

    if (q) {
      list = list.filter(x => {
        const a = String(x.studentcareerenrollment || '').toLowerCase();
        const b = String(x.id || '').toLowerCase();
        return a.includes(q) || b.includes(q);
      });
    }

    this._renderList(list);
  }

  _renderList(items) {
    const host = document.getElementById('cycle-enrollments-container');
    if (!host) return;
    host.innerHTML = '';

    if (!Array.isArray(items) || items.length === 0) {
      host.innerHTML = `<p class="text-indigo-400 text-sm">No se encontraron resultados.</p>`;
      return;
    }

    const tpl = document.getElementById('tmpl-cycle-enrollment-card');
    for (const en of items) {
      const node = tpl.content.cloneNode(true);

      node.querySelector('#student-name').textContent = en.studentcareerenrollment || '—';
      node.querySelector('#cycle-info').textContent = en.yearcycle || '—';

      node.querySelector('#status').textContent = en.status || '—';
      node.querySelector('#registered-at').textContent = this._fmtDate(en.registeredAt);
      node.querySelector('#completed-at').textContent = this._fmtDate(en.completedAt);

      node.querySelector('#view-cycle-enrollment-btn')
        ?.addEventListener('click', () => this._openDetail(en));

      host.appendChild(node);
    }
  }

  _openDetail(en) {
    const tpl = document.getElementById('tmpl-cycle-enrollment-detail');
    const node = tpl.content.cloneNode(true);

    node.querySelector('#detail-student').textContent = en.studentcareerenrollment || '—';
    node.querySelector('#detail-cycle-info').textContent = en.yearcycle || '—';
    node.querySelector('#detail-status').textContent = en.status || '—';
    node.querySelector('#detail-registered-at').textContent = this._fmtDate(en.registeredAt);
    node.querySelector('#detail-completed-at').textContent = this._fmtDate(en.completedAt);

    const wrapper = document.createElement('div');
    wrapper.appendChild(node);

    new Modal({ size: 'md', content: wrapper.innerHTML });
  }

  _yearOf(d) {
    if (!d) return NaN;
    const dt = (d instanceof Date) ? d : new Date(d);
    return Number.isNaN(dt.getTime()) ? NaN : dt.getFullYear();
  }

  _fmtDate(d) {
    if (!d) return '—';
    const dt = (d instanceof Date) ? d : new Date(d);
    if (Number.isNaN(dt.getTime())) return String(d);
    return dt.toLocaleDateString('es-SV', { year: 'numeric', month: '2-digit', day: '2-digit' });
  }
}
