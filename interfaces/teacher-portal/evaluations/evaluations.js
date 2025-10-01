import { Interface } from "../../base/interface.js";
import { EvaluationInstrumentsService } from "../../../js/services/evaluation-instruments.service.js";
import { Modal } from "../../../components/components";
import { Toast } from "../../../components/components";

export default class EvaluationInstrumentsInterface extends Interface {

    static getTemplate() {
        return `
        <main class="flex flex-col min-h-screen p-10 md:ml-80">

            <div class="flex items-center justify-between mb-10">
                <h1
                    class="text-2xl font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow select-none">
                    Evaluaciones
                </h1>

                <div
                    class="block transition-shadow duration-300 bg-transparent group rounded-xl hover:bg-white hover:shadow-lg">

                    <button id="create-evaluation-btn" type="button"
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
                    Crear evaluación
                        </span>

                    </button>
                </div>
            </div>

            <div id="evaluations-container"
                class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 pb-36">
            </div>
        </main>

        <template id="tmpl-create-evaluation">
            <form id="evaluation-form" novalidate class="flex flex-col max-w-md px-6 mx-auto gap-14 py-14">

                <div class="flex flex-col items-center">
                    <span
                        class="text-3xl font-bold text-center mb-2 drop-shadow bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent select-none">
                        Nueva evaluación
                    </span>

                    <span
                        class="text-xl font-semibold text-center drop-shadow bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent select-none">
                        Llena los campos requeridos
                    </span>
                </div>

                <div class="flex flex-col gap-6">
                    <input id="eval-title" type="text"
                        class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-6 py-4 rounded-lg focus:outline-none text-indigo-500 placeholder:text-indigo-300 text-xl placeholder:italic text-shadow shadow-md border-none"
                        placeholder="Título" required>

                    <textarea id="eval-description" rows="4"
                        class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-6 py-4 rounded-lg focus:outline-none text-indigo-500 placeholder:text-indigo-300 text-xl placeholder:italic text-shadow shadow-md border-none resize-none"
                        placeholder="Descripción" required></textarea>
                </div>

                <div class="flex justify-end gap-3">
                    <button type="button" id="cancel-evaluation-btn"
                        class="p-4 bg-gradient-to-tr from-indigo-100 to-blue-100 text-indigo-400 hover:scale-[1.015] hover:from-indigo-200 hover:to-blue-200 rounded-xl font-medium shadow-md transition-all">
                        Cancelar
                    </button>

                    <button type="submit"
                        class="p-4 bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] text-white drop-shadow rounded-xl font-medium shadow-md hover:from-[rgb(var(--body-from))]0 hover:to-[rgb(var(--body-to))]0 hover:scale-[1.015] transition-all">
                        Guardar
                    </button>
                </div>
            </form>
        </template>
        `;
    }

        async init() {
        this.toast = new Toast();
        await this.toast.init();

        this.service = new EvaluationInstrumentsService();

        await this._loadData();
        this._bindCreateButton();
    }

    async _loadData() {
        try {
            const instruments = await this.service.getAll();
            const container = document.getElementById('evaluations-container');
            if (!container) return;

            container.innerHTML = instruments.map(inst => `
                <div class="bg-gradient-to-br from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] rounded-xl p-6 shadow-md flex flex-col justify-between">
                    <div>
                        <h2 class="text-lg font-bold text-indigo-700">${inst.description}</h2>
                        <p class="text-xs text-indigo-400 font-semibold">Tipo: ${inst.instrumentTypeID}</p>
                        <p class="text-sm text-indigo-600">Usa rúbrica: ${inst.usesRubric}</p>
                    </div>
                    <div class="flex justify-end gap-3 mt-4">
                        <button class="edit-evaluation-btn p-3 bg-indigo-100 text-indigo-400 rounded-xl shadow-md" data-id="${inst.instrumentID}">Editar</button>
                        <button class="delete-evaluation-btn p-3 bg-red-100 text-red-400 rounded-xl shadow-md" data-id="${inst.instrumentID}">Eliminar</button>
                    </div>
                </div>
            `).join('');

            this._bindInstrumentButtons();
        } catch (err) {
            this.toast.show('Error al cargar evaluaciones');
            console.error(err);
        }
    }

    _bindCreateButton() {
        const btn = document.getElementById('create-evaluation-btn');
        if (!btn) return;

        btn.addEventListener('click', async () => {
            const modal = new Modal({ templateId: 'tmpl-create-evaluation', size: 'sm' });
            await modal._open();

            const form = document.getElementById('evaluation-form');
            const cancelBtn = document.getElementById('cancel-evaluation-btn');
            if (!form || !cancelBtn) return;

            cancelBtn.addEventListener('click', () => modal.close());

            form.addEventListener('submit', async e => {
                e.preventDefault();
                const title = document.getElementById('eval-title').value.trim();
                const desc = document.getElementById('eval-description').value.trim();
                if (!title || !desc) return this.toast.show('Todos los campos son obligatorios', 5000);

                try {
                    await this.service.create({ instrumentTypeID: 'default', description: desc, usesRubric: 'no' });
                    this.toast.show('Evaluación creada correctamente');
                    modal.close();
                    await this._loadData();
                } catch (err) {
                    console.error(err);
                    this.toast.show('Error al crear evaluación');
                }
            });
        });
    }

    _bindInstrumentButtons() {
        document.querySelectorAll('.edit-evaluation-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                const instrument = (await this.service.getAll()).find(i => i.instrumentID === id);
                if (!instrument) return;

                const modal = new Modal({ templateId: 'tmpl-create-evaluation', size: 'sm' });
                await modal._open();

                document.getElementById('eval-title').value = instrument.description;
                document.getElementById('eval-description').value = instrument.usesRubric;

                document.getElementById('cancel-evaluation-btn').addEventListener('click', () => modal.close());
            });
        });

        document.querySelectorAll('.delete-evaluation-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                try {
                    await this.service.delete(id);
                    this.toast.show('Evaluación eliminada correctamente');
                    await this._loadData();
                } catch (err) {
                    console.error(err);
                    this.toast.show('Error al eliminar evaluación');
                }
            });
        });
    }
}

/*import { ROUTES } from './../../../js/lib/routes.js';

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
        <div class="bg-gradient-to-br from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] rounded-xl p-6 shadow-md hover:shadow-lg transition-all flex flex-col justify-between">
            <div class="space-y-2">
                <h2 class="text-lg font-bold bg-gradient-to-r from-[rgb(var(--body-from))]0 to-[rgb(var(--body-to))]0 bg-clip-text text-transparent drop-shadow select-none">
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
                    class="p-3 bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] text-white drop-shadow rounded-xl font-medium shadow-md hover:from-[rgb(var(--body-from))]0 hover:to-[rgb(var(--body-to))]0 hover:scale-[1.015] transition-all view-results-btn"
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
}*/
