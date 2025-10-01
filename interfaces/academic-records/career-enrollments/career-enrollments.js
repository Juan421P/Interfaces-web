import { Interface } from './../../interfaces.js';
import { CareersService } from './../../../js/services/careers.service.js';
import { StudentCareerEnrollmentsService } from './../../../js/services/student-career-enrollments.service.js';
import { Modal } from './../../../components/overlay/modal/modal.js';
import { Button } from './../../../components/basic/button/button.js';
import { Select } from './../../../components/form/select/select.js';
import { FormInput } from './../../../components/form/form-input/form-input.js';

export default class StudentCareerEnrollmentsInterface extends Interface {

  static getTemplate() {
    return `
<main class="flex flex-col min-h-screen p-10 md:ml-80">

  <div class="flex">
    <h1
      class="text-2xl font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow select-none mb-10 py-3">
      Inscripciones a Carreras
    </h1>
  </div>

  <div class="flex flex-col mb-10 lg:flex-row lg:items-end lg:gap-6">
    <div class="flex-1 mb-4 lg:mb-0">
      <div id="career-select-container"></div>
    </div>
    <div class="flex flex-col flex-1 mb-4 lg:mb-0">
      <div id="status-select-container"></div>
    </div>
    <div class="flex-1">
      <div id="search-input-container"></div>
    </div>
    <div id="button-host" class="block transition-shadow duration-300 bg-transparent group rounded-xl"></div>
  </div>

  <div id="career-enrollments-container" class="flex flex-col gap-8"></div>
</main>

<template id="tmpl-career-enrollment-card">
  <div
    class="bg-gradient-to-br from-[rgb(var(--card-from))] to-[rgb(var(--card-to))] rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
    <div class="flex items-start justify-between">
      <div>
        <h2 id="student-name"
            class="text-lg font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow select-none">
        </h2>
        <p id="career-info" class="text-xs font-semibold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent"></p>
      </div>
      <button type="button" id="view-career-enrollment-btn" title="Ver detalles">
        <svg xmlns="http://www.w3.org/2000/svg"
             class="w-5 h-5 text-indigo-400 transition-all hover:text-indigo-500 hover:scale-110" fill="none"
             viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="5" r="1" />
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="19" r="1" />
        </svg>
      </button>
    </div>

    <div class="mt-2 text-sm bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent">
      <p><span class="font-semibold">Estado:</span> <span id="status"></span></p>
      <p><span class="font-semibold">Inicio:</span> <span id="start-date"></span></p>
      <p><span class="font-semibold">Última actualización:</span> <span id="status-date"></span></p>
    </div>
  </div>
</template>

<template id="tmpl-career-enrollment-detail">
  <div class="p-6">
    <h2 id="detail-student"
        class="text-xl font-bold bg-gradient-to-r from-[rgb(var(--body-from))]0 to-[rgb(var(--body-to))]0 bg-clip-text text-transparent drop-shadow select-none mb-2">
    </h2>
    <p id="detail-career-info" class="mb-4 text-sm font-semibold text-indigo-400"></p>

    <div class="mb-4 text-sm text-indigo-600">
      <p><span class="font-semibold">Estado:</span> <span id="detail-status"></span></p>
      <p><span class="font-semibold">Fecha de inicio:</span> <span id="detail-start-date"></span></p>
      <p><span class="font-semibold">Última actualización:</span> <span id="detail-status-date"></span></p>
    </div>
  </div>
</template>
    `;
  }

  async init() {
    // estado interno de filtros y datos
    this._filters = { careerID: '', status: '', search: '' };
    this._allEnrollments = [];

    // cargar datos reales
    const [careers, enrollments] = await Promise.all([
      CareersService.list(),
      StudentCareerEnrollmentsService.list()
    ]);
    this._allEnrollments = Array.isArray(enrollments) ? enrollments : [];

    // montar controles (Selects, input, botón)
    this._mountControls(careers, this._allEnrollments);

    // primer render con datos completos
    this._applyFilters();
  }

  _mountControls(careers, enrollments) {
    // Careers: tableOrigin=true (usa id/label)
    new Select({
      host: '#career-select-container',
      data: careers,
      tableOrigin: true,
      idField: 'careerID',
      labelField: 'careerName',
      label: 'Filtrar por carreras',
      placeholder: 'Todas',
      name: 'filter-career',
      onChange: (value /*, text */) => {
        this._filters.careerID = value || '';
        this._applyFilters();
      }
    });

    // Status: array plano de strings (tableOrigin=false)
    const statuses = [...new Set(enrollments.map(e => e.status).filter(Boolean))];
    new Select({
      host: '#status-select-container',
      data: statuses,
      tableOrigin: false,
      label: 'Filtrar por estado',
      placeholder: 'Todos',
      name: 'filter-status',
      onChange: (value /*, text */) => {
        this._filters.status = value || '';
        this._applyFilters();
      }
    });

    // Input de búsqueda
    new FormInput({
      host: '#search-input-container',
      placeholder: 'Buscar',
      label: 'Buscar',
      validationMethod: 'simpleText'
    });

    // Botón buscar
    new Button({
      host: '#button-host',
      text: 'Buscar',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="stroke-current fill-none w-6 h-6"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>',
      onClick: () => {
        const inputEl = document.querySelector('#search-input-container input');
        this._filters.search = (inputEl?.value || '').trim().toLowerCase();
        this._applyFilters();
      }
    });
  }

  _applyFilters() {
    const { careerID, status, search } = this._filters;
    let list = this._allEnrollments.slice();

    if (careerID) {
      list = list.filter(x => String(x.careerID) === String(careerID));
    }
    if (status) {
      list = list.filter(x => String(x.status) === String(status));
    }
    if (search) {
      list = list.filter(x => {
        const a = (x.studentName || '').toLowerCase();
        const b = (x.careerName || '').toLowerCase();
        const c = (x.status || '').toLowerCase();
        return a.includes(search) || b.includes(search) || c.includes(search);
      });
    }

    this._renderList(list);
  }

  _renderList(items) {
    const host = document.getElementById('career-enrollments-container');
    if (!host) return;

    host.innerHTML = '';

    if (!Array.isArray(items) || items.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'text-sm italic text-[rgb(var(--placeholder-from))]';
      empty.textContent = 'Sin resultados';
      host.appendChild(empty);
      return;
    }

    const tpl = document.getElementById('tmpl-career-enrollment-card');
    for (const en of items) {
      const node = tpl.content.cloneNode(true);

      node.querySelector('#student-name').textContent = en.studentName || '—';
      node.querySelector('#career-info').textContent = en.careerName || '';
      node.querySelector('#status').textContent = en.status || '—';
      node.querySelector('#start-date').textContent = en.startDate || '—';
      node.querySelector('#status-date').textContent = en.statusDate || '—';

      const btn = node.querySelector('#view-career-enrollment-btn');
      btn?.addEventListener('click', () => this._openDetail(en));

      host.appendChild(node);
    }
  }

  _openDetail(en) {
    const tpl = document.getElementById('tmpl-career-enrollment-detail');
    const node = tpl.content.cloneNode(true);

    node.querySelector('#detail-student').textContent = en.studentName || '—';
    node.querySelector('#detail-career-info').textContent = en.careerName || '';
    node.querySelector('#detail-status').textContent = en.status || '—';
    node.querySelector('#detail-start-date').textContent = en.startDate || '—';
    node.querySelector('#detail-status-date').textContent = en.statusDate || '—';

    const wrapper = document.createElement('div');
    wrapper.appendChild(node);

    // El Modal que me pasaste abre en el constructor (_open() interno). No llamo .open()
    new Modal({ size: 'md', content: wrapper.innerHTML });
  }
}
