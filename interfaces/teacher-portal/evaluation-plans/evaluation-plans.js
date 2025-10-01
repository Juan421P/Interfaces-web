// interfaces/evaluation-plans.interface.js
import { Interface } from './../../interfaces.js';
import { EvaluationPlansService } from './../../../js/services/evaluation-plans.service.js';
import { CourseOfferingsService } from './../../../js/services/course-offerings.service.js';
import { Modal, ContextMenu } from '../../../components/components.js';
import { Select } from '../../../components/form/select/select.js'; 

export default class EvaluationPlansInterface extends Interface {
  static getTemplate() {
    return `
<main class="flex flex-col min-h-screen p-10 md:ml-80">

  <div class="flex items-center justify-between mb-10">
    <h1
      class="text-2xl font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow select-none">
      Planes de Evaluación
    </h1>

    <div class="block transition-shadow duration-300 bg-transparent group rounded-xl hover:bg-white hover:shadow-lg">
      <button id="create-plan-btn" type="button"
        class="flex items-center gap-5 px-5 py-4 text-indigo-400 transition-colors duration-300 rounded-lg group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-blue-400">
        <svg xmlns="http://www.w3.org/2000/svg"
          class="flex-shrink-0 w-6 h-6 text-indigo-400 transition-colors duration-300 stroke-current group-hover:text-white drop-shadow fill-none"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12h8" />
          <path d="M12 8v8" />
        </svg>
        <span
          class="hidden pr-1 font-medium transition-all duration-300 select-none lg:block group-hover:text-white drop-shadow">
          Crear plan
        </span>
      </button>
    </div>
  </div>

  <div id="plans-container" class="relative flex flex-col gap-8 pb-36">
    <!-- timeline line se inserta por JS -->
  </div>
</main>

<!-- Card -->
<template id="tmpl-plan-card">
  <div id="plan-card" class="relative pl-10">
    <div class="absolute top-8 left-3 w-3 h-3 bg-gradient-to-br from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] rounded-full shadow-md"></div>

    <div class="bg-gradient-to-br from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
      <div class="flex items-start justify-between">
        <div>
          <h2 id="plan-title"
              class="text-lg font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow select-none">
          </h2>
          <p id="plan-period"
             class="text-xs bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent font-semibold">
          </p>
        </div>

        <button type="button" id="context-menu-btn" aria-label="Más acciones">
          <svg xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5 text-indigo-400 transition-all hover:text-indigo-500 hover:scale-110" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </button>
      </div>

      <p id="plan-description" class="text-sm text-indigo-600 mt-2"></p>

      <div class="flex justify-end gap-3 mt-4">
        <button type="button" id="view-plan-btn"
          class="group py-3 px-4 bg-gradient-to-tr from-indigo-100 to-blue-100 hover:scale-[1.015] hover:from-indigo-200 hover:to-blue-200 rounded-xl font-medium shadow-md transition-all">
          <span class="bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent">
            Ver Detalle
          </span>
        </button>

        <button type="button" id="edit-plan-btn"
          class="py-3 px-4 bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] text-white drop-shadow rounded-xl font-medium shadow-md hover:scale-[1.015] transition-all">
          Editar Plan
        </button>
      </div>
    </div>
  </div>
</template>

<!-- Modal Crear/Editar (usa tu Select) -->
<template id="tmpl-upsert-plan">
  <form id="plan-form" novalidate class="flex flex-col max-w-md px-6 mx-auto gap-8 py-10">
    <div class="flex flex-col items-center">
      <span class="text-3xl font-bold text-center mb-2 drop-shadow bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent select-none">
        Plan de Evaluación
      </span>
      <span class="text-sm font-semibold text-center drop-shadow bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent select-none">
        Completa los campos requeridos
      </span>
    </div>

    <div class="flex flex-col gap-2">
      <label class="text-xs font-semibold text-indigo-400 select-none">Nombre del plan</label>
      <input id="plan-name" type="text" required
        class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-4 py-3 rounded-lg focus:outline-none text-indigo-600 placeholder:text-indigo-300 placeholder:italic shadow-md border-none"
        placeholder="p. ej. Plan de Evaluaciones - BD I" />
    </div>

    <div class="flex flex-col gap-2">
      <label class="text-xs font-semibold text-indigo-400 select-none">Oferta de curso</label>
      <div id="co-select-host"></div> <!-- 👈 host para tu Select -->
    </div>

    <div class="flex flex-col gap-2">
      <label class="text-xs font-semibold text-indigo-400 select-none">Fecha de creación</label>
      <input id="plan-createdAt" type="date"
        class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-4 py-3 rounded-lg focus:outline-none text-indigo-600 shadow-md border-none" />
    </div>

    <div class="flex flex-col gap-2">
      <label class="text-xs font-semibold text-indigo-400 select-none">Descripción (opcional)</label>
      <textarea id="plan-description-input" rows="3"
        class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-4 py-3 rounded-lg focus:outline-none text-indigo-600 placeholder:text-indigo-300 placeholder:italic shadow-md border-none resize-none"
        placeholder="Descripción general (máx. 200 caracteres)"></textarea>
    </div>

    <div class="flex justify-end gap-3 pt-2">
      <button type="button" id="cancel-plan-btn"
        class="p-3 bg-gradient-to-tr from-indigo-100 to-blue-100 text-indigo-500 hover:scale-[1.015] rounded-xl font-medium shadow-md transition-all">
        Cancelar
      </button>

      <button type="submit"
        class="p-3 bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] text-white drop-shadow rounded-xl font-medium shadow-md hover:scale-[1.015] transition-all">
        Guardar
      </button>
    </div>
  </form>
</template>

<!-- Modal Detalle -->
<template id="tmpl-plan-detail">
  <div class="p-6">
    <h2 id="detail-title"
      class="text-xl font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow select-none mb-2">
    </h2>
    <p id="detail-period" class="mb-2 text-sm font-semibold text-indigo-400"></p>
    <div class="mb-4 text-sm text-indigo-600 space-y-1">
      <p><span class="font-semibold">Descripción:</span> <span id="detail-description"></span></p>
      <p><span class="font-semibold">Fecha de creación:</span> <span id="detail-createdAt"></span></p>
      <p><span class="font-semibold">Course Offering ID:</span> <span id="detail-co"></span></p>
    </div>
  </div>
</template>
    `;
  }

  async init() {
    this.service = new EvaluationPlansService();
    this.contextMenu = new ContextMenu();
    this._coSelect = null; // instancia del Select en el modal

    await this._loadPlans();

    const createBtn = document.getElementById('create-plan-btn');
    if (createBtn) createBtn.addEventListener('click', () => this._openUpsertModal());
  }

  // ===== Data =====
  async _loadPlans() {
    try {
      this.plans = await EvaluationPlansService.getAll();
    } catch (err) {
      console.error('[EvaluationPlans] getAll failed:', err);
      this.plans = [];
    }
    this._renderPlans();
  }

  // ===== Render =====
  _renderPlans() {
    const container = document.getElementById('plans-container');
    if (!container) return;

    container.innerHTML = '<div id="timeline-line" class="absolute left-4 w-1 bg-gradient-to-r from-indigo-300 to-blue-300 rounded-full"></div>';

    if (!Array.isArray(this.plans) || this.plans.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'text-indigo-400 text-sm';
      empty.textContent = 'No hay planes de evaluación.';
      container.appendChild(empty);
      this._updateTimelineHeight();
      return;
    }

    this.plans.forEach(plan => {
      const tpl = document.getElementById('tmpl-plan-card').content.cloneNode(true);

      const name = plan.planName ?? '';
      const desc = plan.description ?? '';
      const coLabel = plan.courseoffering || (plan.courseOfferingID ? `CO: ${plan.courseOfferingID}` : '—');

      tpl.querySelector('#plan-title').textContent = name;
      tpl.querySelector('#plan-period').textContent = coLabel;
      tpl.querySelector('#plan-description').textContent = desc || '(Sin descripción)';

      tpl.querySelector('#view-plan-btn')?.addEventListener('click', () => this._openDetail(plan));
      tpl.querySelector('#edit-plan-btn')?.addEventListener('click', () => this._openUpsertModal(plan));
      tpl.querySelector('#context-menu-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        this.contextMenu.open(
          rect.left,
          rect.bottom + window.scrollY,
          [
            { label: 'Editar', className: 'hover:bg-indigo-50 text-indigo-500 font-medium', onClick: () => this._openUpsertModal(plan) },
            { label: 'Eliminar', className: 'hover:bg-rose-50 text-rose-500 font-medium', onClick: () => this._deletePlan(plan) }
          ],
          'bl'
        );
      });

      container.appendChild(tpl);
    });

    this._updateTimelineHeight();
  }

  _updateTimelineHeight() {
    const container = document.getElementById('plans-container');
    const cards = container?.querySelectorAll('#plan-card');
    const line = container?.querySelector('#timeline-line');
    const dotCenterOffsetFromCardTop = 38;

    if (cards?.length && line) {
      const firstTop = cards[0].offsetTop;
      const lastTop = cards[cards.length - 1].offsetTop;
      line.style.top = `${firstTop + dotCenterOffsetFromCardTop}px`;
      line.style.height = `${(lastTop - firstTop)}px`;
    } else if (line) {
      line.style.top = '0px';
      line.style.height = '0px';
    }
  }

  // ===== Modales =====
  async _openUpsertModal(plan = null) {
    const modal = new Modal({ templateId: 'tmpl-upsert-plan', size: 'sm' });
    await modal.open();

    // Cargar offerings y montar tu Select
    try {
      const offerings = await CourseOfferingsService.getAll(); // [{courseOfferingID, subject, yearcycleName}]
      const host = document.getElementById('co-select-host');

      // construimos un label bonito sin inventar campos (solo combinamos los ya existentes)
      const data = Array.isArray(offerings)
        ? offerings.map(o => ({
            ...o,
            label: o.subject ? `${o.subject}${o.yearcycleName ? ' • ' + o.yearcycleName : ''}` : o.courseOfferingID
          }))
        : [];

      this._coSelect = new Select({
        host,
        data,
        tableOrigin: true,
        idField: 'courseOfferingID',
        labelField: 'label',
        label: null,
        placeholder: 'Selecciona…',
        name: 'courseOffering'
      });

      // Prefill valor si estamos editando
      if (plan?.courseOfferingID) {
        this._coSelect.setValue(plan.courseOfferingID);
      }
    } catch (err) {
      console.error('[EvaluationPlans] load offerings for Select failed:', err);
      this._coSelect = null;
    }

    // Prefill de los otros campos
    if (plan) {
      document.getElementById('plan-name').value = plan.planName ?? '';
      document.getElementById('plan-description-input').value = plan.description ?? '';
      document.getElementById('plan-createdAt').value = plan.createdAt ?? '';
    }

    document.getElementById('cancel-plan-btn')?.addEventListener('click', () => modal.close());

    document.getElementById('plan-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();

      const payload = {
        courseOfferingID: this._coSelect?.getValue() || '',
        planName: document.getElementById('plan-name').value?.trim() || '',
        description: document.getElementById('plan-description-input').value?.trim() || '',
        createdAt: document.getElementById('plan-createdAt').value || null
      };

      try {
        if (plan?.evaluationPlanID) {
          await EvaluationPlansService.update(plan.evaluationPlanID, payload);
        } else {
          await EvaluationPlansService.create(payload);
        }
        await modal.close();
        await this._loadPlans();
      } catch (err) {
        console.error('[EvaluationPlans] upsert failed:', err);
      }
    });
  }

  async _openDetail(plan) {
    const modal = new Modal({ templateId: 'tmpl-plan-detail', size: 'md' });
    await modal.open();

    const coLabel = plan.courseoffering || (plan.courseOfferingID ? `CO: ${plan.courseOfferingID}` : '—');

    document.getElementById('detail-title').textContent = plan.planName ?? '';
    document.getElementById('detail-period').textContent = coLabel;
    document.getElementById('detail-description').textContent = plan.description || '(Sin descripción)';
    document.getElementById('detail-createdAt').textContent = plan.createdAt ? this._fmtDate(plan.createdAt) : '-';
    document.getElementById('detail-co').textContent = plan.courseOfferingID ?? '—';
  }

  async _deletePlan(plan) {
    if (!plan?.evaluationPlanID) return;
    try {
      await EvaluationPlansService.remove(plan.evaluationPlanID);
      await this._loadPlans();
    } catch (err) {
      console.error('[EvaluationPlans] delete failed:', err);
    }
  }

  // ===== util =====
  _fmtDate(iso) {
    try {
      return new Date(iso).toLocaleDateString('es-SV', {
        day: '2-digit', month: 'long', year: 'numeric'
      });
    } catch {
      return iso;
    }
  }
}
