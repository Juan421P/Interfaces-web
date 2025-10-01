import { Interface } from './../../base/interface.js';
import { InstrumentsService } from './../../../js/services/evaluation-instruments.service.js';
import { Modal, Toast } from './../../../components/components.js';

export default class EvaluationInstrumentsInterface extends Interface {

    static getTemplate() {
        return `
            <main class="flex flex-col min-h-screen p-10 md:ml-80">
                <div class="flex items-center justify-between mb-10">
                    <h1 class="text-2xl font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow select-none">
                        Instrumentos de Evaluación
                    </h1>

                    <div class="block transition-shadow duration-300 bg-transparent group rounded-xl hover:bg-white hover:shadow-lg">
                        <button id="add-instrument-btn" type="button"
                            class="flex items-center gap-5 px-5 py-4 text-indigo-400 transition-colors duration-300 rounded-lg group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-blue-400">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                class="flex-shrink-0 w-6 h-6 text-indigo-400 stroke-current group-hover:text-white drop-shadow fill-none"
                                viewBox="0 0 24 24" stroke-width="2">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M8 12h8" />
                                <path d="M12 8v8" />
                            </svg>
                            <span class="hidden font-medium transition-all duration-300 select-none lg:block group-hover:text-white drop-shadow">
                                Agregar instrumento
                            </span>
                        </button>
                    </div>
                </div>

                <section id="instruments-list" class="flex flex-wrap gap-6"></section>
            </main>

            <template id="tmpl-instrument-card">
                <div class="bg-gradient-to-tr from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] rounded-lg shadow p-6 w-64">
                    <h3 class="mb-1 font-semibold text-indigo-700" id="instrument-name"></h3>
                    <p class="text-sm text-indigo-500" id="instrument-type"></p>
                </div>
            </template>

            <template id="tmpl-add-instrument">
                <form id="instrument-form" class="flex flex-col max-w-md gap-10 px-6 py-10 mx-auto">
                    <h2 class="text-2xl font-bold text-center bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow select-none">
                        Nuevo instrumento
                    </h2>
                    <input id="instrument-name-input" type="text"
                        class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-6 py-4 rounded-lg text-indigo-500 placeholder:text-indigo-300 placeholder:italic shadow-md"
                        placeholder="Ej: Examen Final, Investigación" required>
                    <input id="instrument-type-input" type="text"
                        class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-6 py-4 rounded-lg text-indigo-500 placeholder:text-indigo-300 placeholder:italic shadow-md"
                        placeholder="Tipo o categoría (Ej: Práctica, Teórico)" required>
                    <div class="flex justify-end gap-3">
                        <button type="button" id="cancel-btn"
                            class="p-4 font-medium text-indigo-400 transition-all shadow-md bg-gradient-to-tr from-indigo-100 to-blue-100 rounded-xl hover:scale-105">
                            Cancelar
                        </button>
                        <button type="submit"
                            class="p-4 bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] text-white rounded-xl font-medium shadow-md hover:scale-105 transition-all">
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

        await this._setupInstrumentsManagement();
    }

    async _setupInstrumentsManagement() {
        const addBtn = document.querySelector('#add-instrument-btn');

        await this._renderInstruments();

        addBtn.addEventListener('click', async () => {
            const modal = new Modal({
                templateId: 'tmpl-add-instrument',
                size: 'md'
            });
            await modal.open();

            this._setupInstrumentForm(modal);
        });
    }

    async _renderInstruments() {
        try {
            const instruments = await InstrumentsService.list();
            const list = document.querySelector('#instruments-list');
            list.innerHTML = '';

            instruments.forEach(instrument => {
                const tpl = document.querySelector('#tmpl-instrument-card').content.cloneNode(true);
                tpl.querySelector('#instrument-name').textContent = instrument.instrumentName;
                tpl.querySelector('#instrument-type').textContent = `Tipo: ${instrument.type}`;
                list.appendChild(tpl);
            });

        } catch (error) {
            console.error('[EvaluationInstrumentsInterface] Failed to load instruments:', error);
            this.toast.show('Error al cargar los instrumentos de evaluación');
        }
    }

    _setupInstrumentForm(modal) {
        modal.contentHost.querySelector('#cancel-btn').addEventListener('click', () => modal.close());

        modal.contentHost.querySelector('#instrument-form').addEventListener('submit', async e => {
            e.preventDefault();

            const name = e.target.querySelector('#instrument-name-input').value.trim();
            const type = e.target.querySelector('#instrument-type-input').value.trim();

            if (!name || !type) {
                this.toast.show('Todos los campos son obligatorios', 5000);
                return;
            }

            try {
                await InstrumentsService.create({
                    instrumentName: name,
                    type
                });
                this.toast.show('Instrumento agregado correctamente');
                modal.close();
                await this._renderInstruments();
            } catch (error) {
                console.error('[EvaluationInstrumentsInterface] Failed to create instrument:', error);
                this.toast.show('Error al agregar instrumento');
            }
        });
    }
    
}