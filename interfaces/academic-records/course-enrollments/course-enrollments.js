// interfaces/course-enrollments.interface.js
import { Interface } from './../../interfaces.js';
import { CourseEnrollmentService } from './../../../js/services/course-enrollments.service.js';
import { Modal } from './../../../components/overlay/modal/modal.js';

export default class CourseEnrollmentsInterface extends Interface {

  static getTemplate() {
    return `
<main class="flex flex-col min-h-screen p-10 mb-56 md:ml-80">

  <h1
    class="text-2xl font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow select-none mb-10 py-3">
    Inscripciones a Cursos
  </h1>

  <div class="flex flex-col mb-10 lg:flex-row lg:items-end lg:gap-6">
    <div class="flex flex-col flex-1 mb-4 lg:mb-0">
      <label class="mb-1 text-xs font-semibold text-indigo-400 select-none">Curso</label>
      <select id="filter-course"
        class="bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-4 py-3 rounded-lg text-indigo-500 shadow-md focus:outline-none">
        <option value="">Todos</option>
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
      <label class="mb-1 text-xs font-semibold text-indigo-400 select-none">Estado</label>
      <select id="filter-status"
        class="bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-4 py-3 rounded-lg text-indigo-500 shadow-md focus:outline-none">
        <option value="">Todos</option>
        <option value="Activo">Activo</option>
        <option value="Aprobado">Aprobado</option>
        <option value="Reprobado">Reprobado</option>
        <option value="Retirado">Retirado</option>
      </select>
    </div>

    <div class="flex flex-col flex-1">
      <label class="mb-1 text-xs font-semibold text-indigo-400 select-none">Buscar estudiante</label>
      <input id="filter-student" type="text" placeholder="Nombre"
        class="bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-4 py-3 rounded-lg text-indigo-500 shadow-md focus:outline-none placeholder:text-indigo-300 placeholder:italic">
    </div>

    <div class="block transition-shadow duration-300 bg-transparent group rounded-xl hover:bg-white hover:shadow-lg">
      <button id="search-course-enrollments-btn" type="button"
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

  <div id="course-enrollments-container" class="flex flex-col gap-8"></div>
</main>

<template id="tmpl-course-enrollment-card">
  <div class="bg-gradient-to-br from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
    <div class="flex items-start justify-between">
      <div>
        <h2 id="student-name"
            class="text-lg font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow select-none">
        </h2>
        <p id="course-cycle" class="text-xs bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent font-semibold"></p>
      </div>
      <button type="button" id="view-course-enrollment-btn" title="Ver detalles">
        <svg xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5 text-indigo-400 transition-all hover:text-indigo-500 hover:scale-110" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="5" r="1" />
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="19" r="1" />
        </svg>
      </button>
    </div>

    <div class="mt-2 text-sm">
      <p><span
          class="font-semibold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent">Curso:</span>
        <span id="course-name"
          class="bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent"></span>
      </p>
      <p><span
          class="font-semibold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent">Docente:</span>
        <span id="teacher"
          class="bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent"></span>
      </p>
      <p><span
          class="font-semibold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent">Aula:</span>
        <span id="classroom"
          class="bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent"></span>
      </p>
      <p><span
          class="font-semibold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent">Estado:</span>
        <span id="status"
          class="bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent"></span>
      </p>
      <p><span class="font-semibold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent">Nota Final:</span>
        <span id="final-grade"
          class="bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent"></span></p>
    </div>
  </div>
</template>

<template id="tmpl-course-enrollment-detail">
  <div class="p-6">
    <h2 id="detail-student"
        class="text-xl font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow select-none mb-2">
    </h2>
    <p id="detail-course-cycle" class="mb-4 text-sm font-semibold text-indigo-400"></p>

    <div class="mb-4 text-sm text-indigo-600">
      <p><span class="font-semibold">Curso:</span> <span id="detail-course-name"></span></p>
      <p><span class="font-semibold">Docente:</span> <span id="detail-teacher"></span></p>
      <p><span class="font-semibold">Aula:</span> <span id="detail-classroom"></span></p>
      <p><span class="font-semibold">Estado:</span> <span id="detail-status"></span></p>
      <p><span class="font-semibold">Nota Final:</span> <span id="detail-final-grade"></span></p>
      <p><span class="font-semibold">Fecha de Inscripción:</span> <span id="detail-enrollment-date"></span></p>
    </div>
  </div>
</template>
    `;
  }

  async init() {
    // Cargar todos los enrollments (contrato 'table')
    this._all = await CourseEnrollmentService.getAll();

    // Escuchar eventos del Service base y recargar
    this._onServiceEvent = async () => {
      this._all = await CourseEnrollmentService.getAll();
      this._populateFilters(this._all);
      this._applyFilters();
    };
    document.addEventListener('CourseEnrollmentService:post', this._onServiceEvent);
    document.addEventListener('CourseEnrollmentService:put', this._onServiceEvent);
    document.addEventListener('CourseEnrollmentService:delete', this._onServiceEvent);

    // UI
    this._bindUI();
    this._populateFilters(this._all);
    this._renderList(this._all);
  }

  _bindUI() {
    const btn = document.getElementById('search-course-enrollments-btn');
    if (btn) btn.addEventListener('click', () => this._applyFilters());
  }

  _populateFilters(items) {
    // Cursos (courseOfferingName)
    const courseSel = document.getElementById('filter-course');
    if (courseSel) {
      const prev = courseSel.value;
      courseSel.innerHTML = `<option value="">Todos</option>`;
      const courses = [...new Set(items.map(x => x.courseOfferingName).filter(Boolean))].sort();
      courses.forEach(c =>
        courseSel.insertAdjacentHTML('beforeend', `<option value="${this._esc(c)}">${this._esc(c)}</option>`)
      );
      if (courses.includes(prev)) courseSel.value = prev;
    }

    // Ciclo => usamos AÑO derivado de enrollmentDate (no hay cycleLabel en DTO)
    const cycleSel = document.getElementById('filter-cycle');
    if (cycleSel) {
      const prev = cycleSel.value;
      cycleSel.innerHTML = `<option value="">Todos</option>`;
      const years = [...new Set(items
        .map(x => this._yearOf(x.enrollmentDate))
        .filter(y => Number.isFinite(y)))].sort((a,b)=>a-b);
      years.forEach(y => cycleSel.insertAdjacentHTML('beforeend', `<option value="${y}">${y}</option>`));
      if (years.map(String).includes(prev)) cycleSel.value = prev;
    }
  }

  _applyFilters() {
    const course = (document.getElementById('filter-course')?.value || '').trim();
    const cycle  = (document.getElementById('filter-cycle')?.value || '').trim(); // año
    const status = (document.getElementById('filter-status')?.value || '').trim();
    const q      = (document.getElementById('filter-student')?.value || '').trim().toLowerCase();

    let list = this._all.slice();

    if (course) list = list.filter(x => String(x.courseOfferingName || '') === course);
    if (cycle)  list = list.filter(x => String(this._yearOf(x.enrollmentDate)) === cycle);
    if (status) list = list.filter(x => String(x.enrollmentStatus || '') === status);

    if (q) {
      list = list.filter(x => String(x.studentName || '').toLowerCase().includes(q));
    }

    this._renderList(list);
  }

  _renderList(items) {
    const host = document.getElementById('course-enrollments-container');
    if (!host) return;
    host.innerHTML = '';

    if (!Array.isArray(items) || items.length === 0) {
      host.innerHTML = `<p class="text-indigo-400 text-sm">No se encontraron resultados.</p>`;
      return;
    }

    const tpl = document.getElementById('tmpl-course-enrollment-card');
    for (const en of items) {
      const node = tpl.content.cloneNode(true);

      // Cabecera
      node.querySelector('#student-name').textContent = en.studentName || '—';
      const year = this._yearOf(en.enrollmentDate);
      const headerInfo = [en.courseOfferingName, Number.isFinite(year) ? `Ciclo ${year}` : null]
        .filter(Boolean).join(' • ');
      node.querySelector('#course-cycle').textContent = headerInfo || '—';

      // Campos disponibles del DTO
      node.querySelector('#course-name').textContent = en.courseOfferingName || '—';
      node.querySelector('#status').textContent = en.enrollmentStatus || '—';
      node.querySelector('#final-grade').textContent = (en.finalGrade ?? '') === '' ? '—' : String(en.finalGrade);

      // No existen en el DTO → no inventamos
      node.querySelector('#teacher').textContent = '—';
      node.querySelector('#classroom').textContent = '—';

      node.querySelector('#view-course-enrollment-btn')
        ?.addEventListener('click', () => this._openDetail(en));

      host.appendChild(node);
    }
  }

  _openDetail(en) {
    const tpl = document.getElementById('tmpl-course-enrollment-detail');
    const node = tpl.content.cloneNode(true);

    const year = this._yearOf(en.enrollmentDate);
    const headerInfo = [en.courseOfferingName, Number.isFinite(year) ? `Ciclo ${year}` : null]
      .filter(Boolean).join(' • ');

    node.querySelector('#detail-student').textContent = en.studentName || '—';
    node.querySelector('#detail-course-cycle').textContent = headerInfo || '—';
    node.querySelector('#detail-course-name').textContent = en.courseOfferingName || '—';
    node.querySelector('#detail-status').textContent = en.enrollmentStatus || '—';
    node.querySelector('#detail-final-grade').textContent = (en.finalGrade ?? '') === '' ? '—' : String(en.finalGrade);
    node.querySelector('#detail-enrollment-date').textContent = this._fmtDate(en.enrollmentDate);

    // No provistos por el DTO
    node.querySelector('#detail-teacher').textContent = '—';
    node.querySelector('#detail-classroom').textContent = '—';

    const wrapper = document.createElement('div');
    wrapper.appendChild(node);

    // Tu Modal abre en constructor
    new Modal({ size: 'md', content: wrapper.innerHTML });
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

  _esc(s) {
    return String(s).replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
