import { ROUTES } from './../../../js/helpers/routes.js';

const { Modal } = await import(ROUTES.components.modal.js);

const rawEvaluations = [
    {
        title: 'Examen Parcial - Bases de Datos',
        date: '15/08/2025',
        description: 'Evaluación de conceptos clave sobre modelado relacional, normalización y consultas SQL.',
        topics: ['Modelado Relacional', 'Normalización', 'Consultas SQL'],
        questionTypes: ['Opción múltiple', 'Verdadero/Falso', 'Preguntas abiertas']
    },
    {
        title: 'Práctica - Programación II',
        date: '20/08/2025',
        description: 'Resolución de problemas algorítmicos y manejo de estructuras de datos.',
        topics: ['Recursividad', 'Listas Enlazadas', 'Algoritmos de Ordenamiento'],
        questionTypes: ['Código', 'Preguntas Abiertas']
    }
];

export async function init() {
    renderEvaluations();

    document.querySelector('#create-evaluation-btn')
        .addEventListener('click', async () => {
            const modal = new Modal({ templateId: 'tmpl-create-evaluation', size: 'sm' });
            await modal.open();

            document.querySelector('#cancel-evaluation-btn')
                .addEventListener('click', () => modal.close());

            document.querySelector('#evaluation-form')
                .addEventListener('submit', e => {
                    e.preventDefault();
                    // Lógica de guardado real
                    modal.close();
                });
        });
}

function renderEvaluations() {
    document.querySelector('#evaluations-container').innerHTML = rawEvaluations.map(ev => `
        <div class="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-all flex flex-col justify-between">
            <div class="space-y-2">
                <h2 class="text-lg font-bold bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent drop-shadow select-none">
                    ${ev.title}
                </h2>
                <p class="text-xs text-indigo-400 font-semibold">${ev.date}</p>
                <p class="text-sm text-indigo-600">${ev.description}</p>
                <div class="text-xs text-indigo-500">
                    <p class="font-semibold mt-2">Temas Evaluados:</p>
                    <ul class="list-disc list-inside">
                        ${ev.topics.map(t => `<li>${t}</li>`).join('')}
                    </ul>
                </div>
                <div class="text-xs text-indigo-500">
                    <p class="font-semibold mt-2">Tipo de Preguntas:</p>
                    <ul class="list-disc list-inside">
                        ${ev.questionTypes.map(q => `<li>${q}</li>`).join('')}
                    </ul>
                </div>
            </div>

            <div class="flex justify-end gap-3 mt-4">
                <button type="button"
                    class="p-3 bg-gradient-to-tr from-indigo-100 to-blue-100 text-indigo-400 hover:scale-[1.015] hover:from-indigo-200 hover:to-blue-200 rounded-xl font-medium shadow-md transition-all edit-evaluation-btn"
                    data-title="${ev.title}">
                    Editar
                </button>

                <button type="button"
                    class="p-3 bg-gradient-to-tr from-indigo-400 to-blue-400 text-white drop-shadow rounded-xl font-medium shadow-md hover:from-indigo-500 hover:to-blue-500 hover:scale-[1.015] transition-all view-results-btn"
                    data-title="${ev.title}">
                    Ver Resultados
                </button>
            </div>
        </div>
    `).join('');

    bindEvaluationButtons();
}

function bindEvaluationButtons() {
    document.querySelectorAll('.edit-evaluation-btn').forEach(btn =>
        btn.addEventListener('click', async () => {
            const ev = rawEvaluations.find(e => e.title === btn.dataset.title);
            await openEditModal(ev);
        })
    );

    document.querySelectorAll('.view-results-btn').forEach(btn =>
        btn.addEventListener('click', () => {
            console.log(`Resultados de: ${btn.dataset.title}`);
            // Aquí abrir modal con resultados
        })
    );
}

async function openEditModal(ev) {
    const modal = new Modal({ templateId: 'tmpl-create-evaluation', size: 'sm' });
    await modal.open();

    document.querySelector('#eval-title').value = ev.title;
    document.querySelector('#eval-description').value = ev.description;

    document.querySelector('#cancel-evaluation-btn')
        .addEventListener('click', () => modal.close());

    document.querySelector('#evaluation-form')
        .addEventListener('submit', e => {
            e.preventDefault();
            modal.close();
        });
}
