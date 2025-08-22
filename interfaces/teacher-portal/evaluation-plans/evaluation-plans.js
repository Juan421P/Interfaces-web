import { ROUTES } from './../../../js/lib/routes.js';
const { Modal } = await import(ROUTES.components.modal.js);
const { ContextMenu } = await import(ROUTES.components.contextMenu.js);

const rawPlans = [
    {
        title: 'Plan de Evaluaciones - Programación Orientada a Objetos I',
        period: 'Ciclo II - 2025',
        description: 'Este plan organiza todas las evaluaciones para POO, con enfoque en prácticas y teoría de calidad de software.',
        evaluations: ['Examen Teórico 1', 'Proyecto Parcial', 'Práctica de Testing']
    },
    {
        title: 'Plan de Evaluaciones - Bases de Datos I',
        period: 'Ciclo II - 2025',
        description: 'Conjunto de evaluaciones diseñadas para verificar el dominio en modelado relacional, normalización y SQL.',
        evaluations: ['Examen Parcial', 'Laboratorio Normalización', 'Proyecto Final']
    },
    {
        title: 'Plan de Evaluaciones - Matemática II',
        period: 'Ciclo II - 2025',
        description: 'Actividades para evaluar el conocimiento adquirido de los estudiantes durante el ciclo. Incluye álgebra y precálculo.',
        evaluations: ['Examen Teórico 1', 'Examen Teórico 2', 'Examen Teórico 3']
    },
    {
        title: 'Plan de Evaluaciones - Corte de Pelo I',
        period: 'Ciclo II - 2025',
        description: 'Evaluaciones que tienen el objetivo de analizar las habilidades que los estudiantes han desarrollado y los conocimientos que han adquirido.',
        evaluations: ['Examen Parcial', 'Práctica de Corte 1', 'Práctica de Corte 2']
    }
];

const contextMenu = new ContextMenu();

export async function init() {
    renderPlans();

    document.querySelector('#create-plan-btn')
        .addEventListener('click', async () => {
            const modal = new Modal({ templateId: 'tmpl-create-plan', size: 'sm' });
            await modal.open();

            document.querySelector('#cancel-plan-btn').addEventListener('click', () => modal.close());
            document.querySelector('#plan-form').addEventListener('submit', e => {
                e.preventDefault();
                modal.close();
            });
        });
}

function renderPlans() {
    const container = document.querySelector('#plans-container');
    container.innerHTML = '<div id="timeline-line" class="absolute left-4 w-1 bg-gradient-to-r from-indigo-300 to-blue-300 rounded-full"></div>';

    rawPlans.forEach(plan => {
        const tpl = document.querySelector('#tmpl-plan-card').content.cloneNode(true);

        tpl.querySelector('#plan-title').textContent = plan.title;
        tpl.querySelector('#plan-period').textContent = plan.period;
        tpl.querySelector('#plan-description').textContent = plan.description;

        const evalList = tpl.querySelector('#plan-evaluations');
        evalList.innerHTML = plan.evaluations.map(e => `<li>${e}</li>`).join('');

        tpl.querySelector('#view-plan-btn')
            .addEventListener('click', () => openPlanDetail(plan));

        tpl.querySelector('#edit-plan-btn')
            .addEventListener('click', () => openEditModal(plan));

        tpl.querySelector('#context-menu-btn')
            .addEventListener('click', e => {
                e.stopPropagation();
                const rect = e.currentTarget.getBoundingClientRect();

                contextMenu.open(
                    rect.left,
                    rect.bottom + window.scrollY,
                    [
                        {
                            label: 'Duplicar plan',
                            className: 'hover:bg-indigo-50 text-indigo-500 font-medium',
                            onClick: () => duplicatePlan(plan)
                        },
                        {
                            label: 'Agregar evaluación',
                            className: 'hover:bg-indigo-50 text-indigo-500 font-medium',
                            onClick: () => addEvaluation(plan)
                        }
                    ],
                    'bl'
                );
            });

        container.appendChild(tpl);
    });
    updateTimelineHeight();
}

async function openPlanDetail(plan) {
    const tpl = document.querySelector('#tmpl-plan-detail').content.cloneNode(true);

    tpl.querySelector('#detail-title').textContent = plan.title;
    tpl.querySelector('#detail-period').textContent = plan.period;
    tpl.querySelector('#detail-description').textContent = plan.description;
    tpl.querySelector('#detail-evaluations').innerHTML = plan.evaluations.map(e => `<li>${e}</li>`).join('');

    const modal = new Modal({ size: 'md', content: tpl });
    await modal.open();
}

function updateTimelineHeight() {
    const container = document.querySelector('#plans-container');
    const cards = container.querySelectorAll('#plan-card');
    const line = container.querySelector('#timeline-line');

    const dotCenterOffsetFromCardTop = 38;

    if (cards.length > 0 && line) {
        const firstCardTop = cards[0].offsetTop;
        const lastCardTop = cards[cards.length - 1].offsetTop;

        const lineStartY = firstCardTop + dotCenterOffsetFromCardTop;
        const lineEndY = lastCardTop + dotCenterOffsetFromCardTop;

        line.style.top = `${lineStartY}px`;
        line.style.height = `${lineEndY - lineStartY}px`;
    } else {
        if (line) {
            line.style.height = '0px';
            line.style.top = '0px';
        }
    }
}

async function openEditModal(plan) {
    const modal = new Modal({ templateId: 'tmpl-create-plan', size: 'sm' });
    await modal.open();

    document.querySelector('#plan-title').value = plan.title;
    document.querySelector('#plan-period').value = plan.period;
    document.querySelector('#plan-description').value = plan.description;

    document.querySelector('#cancel-plan-btn').addEventListener('click', () => modal.close());
    document.querySelector('#plan-form').addEventListener('submit', e => {
        e.preventDefault();
        modal.close();
    });
}

function duplicatePlan(plan) {
    rawPlans.push({ ...plan, title: plan.title + ' (Copia)' });
    renderPlans();
}

function addEvaluation(plan) {
    plan.evaluations.push('Nueva Evaluación');
    renderPlans();
}
