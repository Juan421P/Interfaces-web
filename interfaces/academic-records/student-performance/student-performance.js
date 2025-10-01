import { Interface } from './../../interfaces.js';
import { CyclicStudentPerformanceService } from './../../../js/services/cyclic-student-performances.service.js';
import { Modal } from '../../../components/components.js'; // mismo import que tu archivo original

export default class CyclicStudentPerformanceInterface extends Interface {

  static getTemplate() {
    return `
<main class="flex flex-col min-h-screen p-10 md:ml-80">

  <h1
      class="text-2xl font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow select-none mb-10 py-3">
      Rendimiento Académico
  </h1>

  <div class="flex flex-col mb-10 lg:flex-row lg:items-end lg:gap-6">
      <div class="flex flex-col flex-1 mb-4 lg:mb-0">
          <label class="mb-1 text-xs font-semibold text-indigo-400 select-none">Carrera</label>
          <select id="filter-career"
              class="bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-4 py-3 rounded-lg text-indigo-500 shadow-md focus:outline-none">
              <option value="">Todas</option>
          </select>
      </div>

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

      <div class="flex flex-col flex-1">
          <label class="mb-1 text-xs font-semibold text-indigo-400 select-none">Buscar estudiante</label>
          <input id="filter-student" type="text" placeholder="Nombre o código"
              class="bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-4 py-3 rounded-lg text-indigo-500 shadow-md focus:outline-none placeholder:text-indigo-300 placeholder:italic">
      </div>

      <div
          class="block transition-shadow duration-300 bg-transparent group rounded-xl hover:bg-white hover:shadow-lg">
          <button id="search-performance-btn" type="button"
              class="flex items-center gap-5 px-5 py-4 text-indigo-400 transition-colors duration-300 rounded-lg group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg"
                  class="flex-shrink-0 w-6 h-6 text-indigo-400 transition-colors duration-300 stroke-current group-hover:text-white drop-shadow fill-none"
                  viewBox="0 0 24 24" stroke-width="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
              </svg>
              <span class="hidden pr-1 font-medium transition-all duration-300 select-none lg:block group-hover:text-white drop-shadow">Buscar</span>
          </button>
      </div>
  </div>

  <div id="performance-container" class="flex flex-col gap-8"></div>
</main>

<template id="tmpl-performance-card">
  <div class="bg-gradient-to-br from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
      <div class="flex items-start justify-between">
          <div>
              <h2 id="student-name"
                  class="text-lg font-bold bg-gradient-to-r from-[rgb(var(--body-from))]0 to-[rgb(var(--body-to))]0 bg-clip-text text-transparent drop-shadow select-none">
              </h2>
              <p id="career-cycle" class="text-xs font-semibold text-indigo-400"></p>
          </div>

          <button type="button" id="view-performance-btn" title="Ver detalles">
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
          <p><span class="font-semibold">UV Totales:</span> <span id="total-uv"></span></p>
          <p><span class="font-semibold">Unidades Mérito Totales:</span> <span id="total-merit"></span></p>
          <p><span class="font-semibold">Coeficiente M.U.:</span> <span id="muc"></span></p>
      </div>

      <p id="computed-at" class="mt-3 text-xs text-indigo-400"></p>
  </div>
</template>

<template id="tmpl-performance-detail">
  <div class="p-6">
      <h2 id="detail-student"
          class="text-xl font-bold bg-gradient-to-r from-[rgb(var(--body-from))]0 to-[rgb(var(--body-to))]0 bg-clip-text text-transparent drop-shadow select-none mb-2">
      </h2>
      <p id="detail-career-cycle" class="mb-4 text-sm font-semibold text-indigo-400"></p>

      <div class="mb-4 text-sm text-indigo-600">
          <p><span class="font-semibold">UV Totales:</span> <span id="detail-total-uv"></span></p>
          <p><span class="font-semibold">Unidades Mérito Totales:</span> <span id="detail-total-merit"></span></p>
          <p><span class="font-semibold">Coeficiente M.U.:</span> <span id="detail-muc"></span></p>
      </div>

      <p class="text-xs text-indigo-400">Calculado el: <span id="detail-computed-at"></span></p>
  </div>
</template>
    `;
  }

  async init() {
    // 1) Traer datos reales
    this._all = await CyclicStudentPerformanceService.getAll();

    // 2) UI: bind + filtros
    this._bindUI();
    this._populateFilters(this._all);
    this._renderList(this._all);
  }

  _bindUI() {
    const btn = document.getElementById('search-performance-btn');
    if (btn) btn.addEventListener('click', () => this._applyFilters());
  }

  _populateFilters(items) {
    // Carrera
    const careerSel = document.getElementById('filter-career');
    if (careerSel) {
      const keep = careerSel.value;
      careerSel.innerHTML = `<option value="">Todas</option>`;
      const careers = [...new Set(items.map(x => x.careerName).filter(Boolean))].sort();
      careers.forEach(c => careerSel.insertAdjacentHTML('beforeend', `<option value="${this._esc(c)}">${this._esc(c)}</option>`));
      if (careers.includes(keep)) careerSel.value = keep;
    }

    // Ciclo -> usamos StudentCycleEnrollment (string del DTO)
    const cycleSel = document.getElementById('filter-cycle');
    if (cycleSel) {
      const keep = cycleSel.value;
      cycleSel.innerHTML = `<option value="">Todos</option>`;
      const cycles = [...new Set(items.map(x => x.StudentCycleEnrollment).filter(Boolean))].sort();
      cycles.forEach(c => cycleSel.insertAdjacentHTML('beforeend', `<option value="${this._esc(c)}">${this._esc(c)}</option>`));
      if (cycles.includes(keep)) cycleSel.value = keep;
    }

    // Año -> derivado de computedAt
    const yearSel = document.getElementById('filter-year');
    if (yearSel) {
      const keep = yearSel.value;
      yearSel.innerHTML = `<option value="">Todos</option>`;
      const years = [...new Set(items.map(x => this._yearOf(x.computedAt)).filter(n => Number.isFinite(n)))].sort((a,b)=>a-b);
      years.forEach(y => yearSel.insertAdjacentHTML('beforeend', `<option value="${y}">${y}</option>`));
      if (years.map(String).includes(keep)) yearSel.value = keep;
    }
  }

  _applyFilters() {
    const career = (document.getElementById('filter-career')?.value || '').trim();
    const cycle  = (document.getElementById('filter-cycle')?.value || '').trim(); // StudentCycleEnrollment
    const year   = (document.getElementById('filter-year')?.value || '').trim();
    const q      = (document.getElementById('filter-student')?.value || '').trim().toLowerCase();

    let list = this._all.slice();

    if (career) list = list.filter(x => String(x.careerName || '') === career);
    if (cycle)  list = list.filter(x => String(x.StudentCycleEnrollment || '') === cycle);
    if (year)   list = list.filter(x => String(this._yearOf(x.computedAt)) === year);

    if (q) {
      list = list.filter(x =>
        String(x.studentName || '').toLowerCase().includes(q) ||
        String(x.studentID || '').toLowerCase().includes(q)
      );
    }

    this._renderList(list);
  }

  _renderList(items) {
    const host = document.getElementById('performance-container');
    if (!host) return;
    host.innerHTML = '';

    if (!Array.isArray(items) || items.length === 0) {
      host.innerHTML = `<p class="text-indigo-400 text-sm">No se encontraron resultados.</p>`;
      return;
    }

    const tpl = document.getElementById('tmpl-performance-card');
    for (const p of items) {
      const node = tpl.content.cloneNode(true);

      // Encabezado
      node.querySelector('#student-name').textContent = p.studentName || '—';
      const cycl = p.StudentCycleEnrollment ? ` • ${p.StudentCycleEnrollment}` : '';
      node.querySelector('#career-cycle').textContent = `${p.careerName || '—'}${cycl}`;

      // Métricas
      node.querySelector('#total-uv').textContent    = this._safeNum(p.totalValueUnits);
      node.querySelector('#total-merit').textContent = this._safeNum(p.totalMeritUnit);
      node.querySelector('#muc').textContent         = this._fmtCoef(p.meritUnitCoefficient);

      // Fecha
      node.querySelector('#computed-at').textContent = `Calculado el ${this._fmtDate(p.computedAt)}`;

      node.querySelector('#view-performance-btn')
        ?.addEventListener('click', () => this._openDetail(p));

      host.appendChild(node);
    }
  }

  _openDetail(p) {
    const tpl = document.getElementById('tmpl-performance-detail');
    const node = tpl.content.cloneNode(true);

    node.querySelector('#detail-student').textContent = p.studentName || '—';
    const cycl = p.StudentCycleEnrollment ? ` • ${p.StudentCycleEnrollment}` : '';
    node.querySelector('#detail-career-cycle').textContent = `${p.careerName || '—'}${cycl}`;

    node.querySelector('#detail-total-uv').textContent    = this._safeNum(p.totalValueUnits);
    node.querySelector('#detail-total-merit').textContent = this._safeNum(p.totalMeritUnit);
    node.querySelector('#detail-muc').textContent         = this._fmtCoef(p.meritUnitCoefficient);
    node.querySelector('#detail-computed-at').textContent = this._fmtDate(p.computedAt);

    const wrap = document.createElement('div');
    wrap.appendChild(node);

    new Modal({ size: 'md', content: wrap.innerHTML });
  }

  // utils
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

  _safeNum(n) {
    return (n === null || n === undefined || n === '') ? '—' : String(n);
  }

  _fmtCoef(n) {
    if (n === null || n === undefined || n === '') return '—';
    const v = Number(n);
    return Number.isFinite(v) ? v.toFixed(2) : String(n);
  }

  _esc(s) {
    return String(s).replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
