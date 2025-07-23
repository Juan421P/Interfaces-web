import { ROUTES } from './../../../js/helpers/routes.js';
const { Modal } = await import(ROUTES.components.modal.js);

const rawPlans = [
    {
        title: 'Plan de Evaluaciones - Ingeniería de Software',
        period: 'Ciclo II - 2025',
        description: 'Este plan organiza todas las evaluaciones para Ingeniería de Software, con enfoque en prácticas y teoría de calidad de software.',
        evaluations: ['Examen Teórico 1', 'Proyecto Parcial', 'Práctica de Testing']
    },
    {
        title: 'Plan de Evaluaciones - Bases de Datos',
        period: 'Ciclo II - 2025',
        description: 'Conjunto de evaluaciones diseñadas para verificar el dominio en modelado relacional, normalización y SQL.',
        evaluations: ['Examen Parcial', 'Laboratorio Normalización', 'Proyecto Final']
    }
];

export async function init() {
    renderPlans();

    document.querySelector('#create-plan-btn')
        .addEventListener('click', async () => {
            const modal = new Modal({ templateId: 'tmpl-create-plan', size: 'sm' });
            await modal.open();

            document.querySelector('#cancel-plan-btn')
                .addEventListener('click', () => modal.close());

            document.querySelector('#plan-form')
                .addEventListener('submit', e => {
                    e.preventDefault();
                    // Aquí se guardaría el nuevo plan real
                    modal.close();
                });
        });
}

function renderPlans() {
    document.querySelector('#plans-container').innerHTML = rawPlans.map((plan, idx) => `
        <div class="relative pl-10">
            <!-- Línea vertical como roadmap -->
            <div class="absolute top-0 left-4 w-1 h-full bg-gradient-to-b from-indigo-200 to-blue-200 rounded-full"></div>

            <!-- Puntos en la línea -->
            <div class="absolute top-4 left-3 w-3 h-3 bg-gradient-to-br from-indigo-400 to-blue-400 rounded-full shadow-md"></div>

            <div class="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
                <h2 class="text-lg font-bold bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent drop-shadow select-none">
                    ${plan.title}
                </h2>
                <p class="text-xs text-indigo-400 font-semibold">${plan.period}</p>
                <p class="text-sm text-indigo-600 mt-2">${plan.description}</p>
                <div class="text-xs text-indigo-500 mt-3">
                    <p class="font-semibold">Evaluaciones incluidas:</p>
                    <ul class="list-disc list-inside">
                        ${plan.evaluations.map(e => `<li>${e}</li>`).join('')}
                    </ul>
                </div>

                <div class="flex justify-end gap-3 mt-4">
                    <button type="button"
                        class="p-3 bg-gradient-to-tr from-indigo-100 to-blue-100 text-indigo-400 hover:scale-[1.015] hover:from-indigo-200 hover:to-blue-200 rounded-xl font-medium shadow-md transition-all view-plan-btn"
                        data-index="${idx}">
                        Ver Detalle
                    </button>

                    <button type="button"
                        class="p-3 bg-gradient-to-tr from-indigo-400 to-blue-400 text-white drop-shadow rounded-xl font-medium shadow-md hover:from-indigo-500 hover:to-blue-500 hover:scale-[1.015] transition-all edit-plan-btn"
                        data-index="${idx}">
                        Editar Plan
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    bindPlanButtons();
}

function bindPlanButtons() {
    document.querySelectorAll('.view-plan-btn').forEach(btn =>
        btn.addEventListener('click', async () => {
            const plan = rawPlans[btn.dataset.index];
            await openPlanDetail(plan);
        })
    );

    document.querySelectorAll('.edit-plan-btn').forEach(btn =>
        btn.addEventListener('click', async () => {
            const plan = rawPlans[btn.dataset.index];
            await openEditModal(plan);
        })
    );
}

async function openPlanDetail(plan) {
    const modal = new Modal({
        size: 'md',
        content: `
            <div class="p-6">
                <h2 class="text-xl font-bold bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent drop-shadow select-none mb-2">
                    ${plan.title}
                </h2>
                <p class="text-sm text-indigo-400 font-semibold mb-4">${plan.period}</p>
                <p class="text-sm text-indigo-600 mb-4">${plan.description}</p>
                <p class="text-xs text-indigo-500 font-semibold">Evaluaciones:</p>
                <ul class="list-disc list-inside text-xs text-indigo-500">
                    ${plan.evaluations.map(e => `<li>${e}</li>`).join('')}
                </ul>
            </div>
        `
    });
    await modal.open();
}

async function openEditModal(plan) {
    const modal = new Modal({ templateId: 'tmpl-create-plan', size: 'sm' });
    await modal.open();

    document.querySelector('#plan-title').value = plan.title;
    document.querySelector('#plan-period').value = plan.period;
    document.querySelector('#plan-description').value = plan.description;

    document.querySelector('#cancel-plan-btn')
        .addEventListener('click', () => modal.close());

    document.querySelector('#plan-form')
        .addEventListener('submit', e => {
            e.preventDefault();
            modal.close();
        });
}