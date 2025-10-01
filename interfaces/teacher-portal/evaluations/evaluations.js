import { Interface } from './../base/interface.js';
import { Modal } from '../../../components/components.js';
import { Select } from '../../../components/form/select/select.js';

import { EvaluationPlansService } from './../../../js/services/evaluation-plans.service.js';
import { EvaluationPlanComponentsService } from './../../../js/services/evaluation-plan-components.service.js';

export default class EvaluationsInterface extends Interface {

  static getTemplate() {
    return `
<main class="flex flex-col min-h-screen p-10 md:ml-80">
  <div class="flex items-center justify-between mb-10">
    <h1 class="text-2xl font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow select-none">
      Evaluaciones
    </h1>

    <div class="block transition-shadow duration-300 bg-transparent group rounded-xl hover:bg-white hover:shadow-lg">
      <button id="create-evaluation-btn" type="button"
        class="flex items-center gap-5 px-5 py-4 text-indigo-400 transition-colors duration-300 rounded-lg group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-blue-400">
        <svg xmlns="http://www.w3.org/2000/svg"
          class="flex-shrink-0 w-6 h-6 text-indigo-400 transition-colors duration-300 stroke-current group-hover:text-white drop-shadow fill-none"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12h8" />
          <path d="M12 8v8" />
        </svg>
        <span class="hidden pr-1 font-medium transition-all duration-300 select-none lg:block group-hover:text-white drop-shadow">
          Crear evaluación
        </span>
      </button>
    </div>
  </div>

  <!-- Filtro por plan -->
  <div class="flex flex-col mb-8 lg:flex-row lg:items-end lg:gap-6">
    <div class="flex-1 mb-4 lg:mb-0">
      <div id="plan-select-container"></div>
    </div>
  </div>

  <div id="evaluations-container" class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 pb-36"></div>
</main>

<!-- Modal crear/editar evaluación (componente) -->
<template id="tmpl-evaluation-form">
  <form id="evaluation-form" novalidate class="flex flex-col max-w-md px-6 mx-auto gap-10 py-10">
    <div class="flex flex-col items-center">
      <span class="text-2xl font-bold text-center mb-2 drop-shadow bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent select-none" id="form-title">
        Nueva evaluación
      </span>
    </div>

    <div class="flex flex-col gap-5">
      <div id="modal-plan-select"></div>

      <input id="cmp-name" type="text"
        class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-5 py-3 rounded-lg focus:outline-none text-indigo-500 placeholder:text-indigo-300 text-base placeholder:italic shadow-md"
        placeholder="Nombre del componente (evaluación)" required>

      <input id="cmp-weight" type="number" step="0.01" min="0.01" max="100"
        class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-5 py-3 rounded-lg focus:outline-none text-indigo-500 placeholder:text-indigo-300 text-base placeholder:italic shadow-md"
        placeholder="% ponderación (0.01 - 100)" required>

      <input id="cmp-order" type="number" min="1"
        class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-5 py-3 rounded-lg focus:outline-none text-indigo-500 placeholder:text-indigo-300 text-base placeholder:italic shadow-md"
        placeholder="Orden (1..n)" value="1">

      <textarea id="cmp-rubric" rows="3"
        class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-5 py-3 rounded-lg focus:outline-none text-indigo-500 placeholder:text-indigo-300 text-base placeholder:italic shadow-md resize-none"
        placeholder="Rúbrica (opcional, máx 100)"></textarea>
    </div>

    <div class="flex justify-end gap-3">
      <button type="button" id="cancel-evaluation-btn"
        class="p-3 bg-gradient-to-tr from-indigo-100 to-blue-100 text-indigo-400 hover:scale-[1.015] hover:from-indigo-200 hover:to-blue-200 rounded-xl font-medium shadow-md transition-all">
        Cancelar
      </button>
      <button type="submit"
        class="p-3 bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] text-white drop-shadow rounded-xl font-medium shadow-md hover:from-[rgb(var(--body-from))]0 hover:to-[rgb(var(--body-to))]0 hover:scale-[1.015] transition-all">
        Guardar
      </button>
    </div>
  </form>
</template>
    `;
  }

  mountIn(hostSel = '#main-view') {
    const host = typeof hostSel === 'string' ? document.querySelector(hostSel) : hostSel;
    if (!host) throw new Error(`[EvaluationsInterface] Host "${hostSel}" no encontrado`);
    host.innerHTML = EvaluationsInterface.getTemplate();
    this.root = host;
  }

  async init() {
    // servicios
    this.plansService = new EvaluationPlansService();
    this.componentsService = new EvaluationPlanComponentsService();

    // estado UI
    this.plans = [];
    this.components = [];
    this.currentPlanId = '';

    await this._loadPlans();
    await this._loadComponents();

    this._renderPlanFilter();
    this._renderList();

    this._bindCreate();
  }

  // ====== DATA ======
  async _loadPlans() {
    try {
      this.plans = await this.plansService.list(); // GET /EvaluationPlans/getEvaluationPlan
    } catch (e) {
      console.error('[EvaluationsInterface] Error cargando planes:', e);
      this.plans = [];
    }
  }

  async _loadComponents() {
    try {
      this.components = await this.componentsService.list(); // GET /EvaluationPlanComponents/getEvaluationPlanComponents
    } catch (e) {
      console.error('[EvaluationsInterface] Error cargando componentes:', e);
      this.components = [];
    }
  }

  // ====== FILTER (Select) ======
  _renderPlanFilter() {
    const data = this.plans.map(p => ({
      evaluationPlanID: p.evaluationPlanID,
      planName: p.planName
    }));

    new Select({
      host: '#plan-select-container',
      data,
      tableOrigin: true,
      idField: 'evaluationPlanID',
      labelField: 'planName',
      label: 'Filtrar por plan',
      placeholder: 'Todos',
      name: 'filter-plan',
      onChange: (val) => {
        this.currentPlanId = val || '';
        this._renderList();
      }
    });
  }

  // ====== LIST ======
  _renderList() {
    const container = document.querySelector('#evaluations-container');
    if (!container) return;

    const list = this.currentPlanId
      ? this.components.filter(c => c.evaluationPlanID === this.currentPlanId)
      : this.components;

    if (!list.length) {
      container.innerHTML = `<p class="text-indigo-400 text-sm">No hay evaluaciones.</p>`;
      return;
    }

    container.innerHTML = list.map(cmp => this._cardHTML(cmp)).join('');
    this._bindCardButtons(list);
  }

  _cardHTML(cmp) {
    // cmp: { componentID, componentName, weightPercentage, orderIndex, rubric, evaluationPlanID, evaluationplans }
    return `
      <div class="bg-gradient-to-br from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] rounded-xl p-6 shadow-md hover:shadow-lg transition-all flex flex-col justify-between">
        <div class="space-y-2">
          <h2 class="text-lg font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow select-none">
            ${cmp.componentName || '(Sin nombre)'}
          </h2>
          <p class="text-xs text-indigo-400 font-semibold">${cmp.evaluationplans || ''}</p>
          <p class="text-sm text-indigo-600">${cmp.rubric ? cmp.rubric : ''}</p>

          <div class="text-xs text-indigo-500 mt-2">
            <p><span class="font-semibold">Peso:</span> ${cmp.weightPercentage ?? '-'}%</p>
            <p><span class="font-semibold">Orden:</span> ${cmp.orderIndex ?? 1}</p>
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-4">
          <button type="button"
            class="p-3 bg-gradient-to-tr from-indigo-100 to-blue-100 text-indigo-400 hover:scale-[1.015] hover:from-indigo-200 hover:to-blue-200 rounded-xl font-medium shadow-md transition-all edit-btn"
            data-id="${cmp.componentID}">
            Editar
          </button>

          <button type="button"
            class="p-3 bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] text-white drop-shadow rounded-xl font-medium shadow-md hover:from-[rgb(var(--body-from))]0 hover:to-[rgb(var(--body-to))]0 hover:scale-[1.015] transition-all del-btn"
            data-id="${cmp.componentID}">
            Eliminar
          </button>
        </div>
      </div>
    `;
  }

  _bindCardButtons(list) {
    document.querySelectorAll('.edit-btn').forEach(btn => {
      const id = btn.dataset.id;
      const cmp = list.find(x => x.componentID === id);
      if (!cmp) return;
      btn.addEventListener('click', () => this._openFormModal('edit', cmp));
    });

    document.querySelectorAll('.del-btn').forEach(btn => {
      const id = btn.dataset.id;
      btn.addEventListener('click', async () => {
        try {
          await this.componentsService.delete(id); // DELETE /deleteEvaluationPlanComponents/{id}
          await this._loadComponents();
          this._renderList();
        } catch (e) {
          console.error('[EvaluationsInterface] Error eliminando componente:', e);
        }
      });
    });
  }

  // ====== CREATE ======
  _bindCreate() {
    const btn = document.querySelector('#create-evaluation-btn');
    if (!btn) return;
    btn.addEventListener('click', () => this._openFormModal('create'));
  }

  async _openFormModal(mode = 'create', cmp = null) {
    const modal = new Modal({ templateId: 'tmpl-evaluation-form', size: 'sm' });
    await modal.open();

    // título modal
    const titleEl = document.querySelector('#form-title');
    if (titleEl) titleEl.textContent = mode === 'create' ? 'Nueva evaluación' : 'Editar evaluación';

    // Select de plan dentro del modal
    const data = this.plans.map(p => ({
      evaluationPlanID: p.evaluationPlanID,
      planName: p.planName
    }));

    const planSel = new Select({
      host: '#modal-plan-select',
      data,
      tableOrigin: true,
      idField: 'evaluationPlanID',
      labelField: 'planName',
      label: 'Plan de evaluación',
      placeholder: 'Seleccione un plan',
      name: 'evaluationPlanID',
      onChange: () => {}
    });

    // refs
    const $name = document.querySelector('#cmp-name');
    const $weight = document.querySelector('#cmp-weight');
    const $order = document.querySelector('#cmp-order');
    const $rubric = document.querySelector('#cmp-rubric');

    // prefill si edita
    if (mode === 'edit' && cmp) {
      planSel.setValue(cmp.evaluationPlanID || '');
      if ($name)   $name.value = cmp.componentName || '';
      if ($weight) $weight.value = (cmp.weightPercentage ?? '').toString();
      if ($order)  $order.value = (cmp.orderIndex ?? 1).toString();
      if ($rubric) $rubric.value = cmp.rubric || '';
    }

    // botones
    document.querySelector('#cancel-evaluation-btn')?.addEventListener('click', () => modal.close());

    document.querySelector('#evaluation-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();

      const payload = {
        evaluationPlanID: planSel.getValue(),
        componentName: $name?.value?.trim() || '',
        weightPercentage: $weight?.value ? Number($weight.value) : null,
        orderIndex: $order?.value ? Number($order.value) : 1,
        rubric: ($rubric?.value || '').slice(0, 100)
      };

      try {
        if (mode === 'create') {
          await this.componentsService.create(payload); // POST /newEvaluationPlanComponents
        } else if (cmp?.componentID) {
          await this.componentsService.update(cmp.componentID, payload); // PUT /uploadEvaluationPlanComponents/{id}
        }
        await this._loadComponents();
        this._renderList();
        modal.close();
      } catch (err) {
        console.error('[EvaluationsInterface] Error guardando componente:', err);
      }
    });
  }
}