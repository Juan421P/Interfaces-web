import { Interface } from './../../base/interface.js';
import { ModalitiesService } from './../../../js/services/modalities.service.js';
import { Modal } from './../../../components/components.js';

export default class ModalitiesInterface extends Interface {

    static getTemplate() {
        return `
            <main class="flex flex-col min-h-screen p-10 md:ml-80">
                <div class="flex items-center justify-between mb-10">
                    <h1 class="text-2xl font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow select-none">
                        Modalidades
                    </h1>

                    <div class="block transition-shadow duration-300 bg-transparent group rounded-xl hover:bg-white hover:shadow-lg">
                        <button id="add-modality-btn" type="button"
                            class="flex items-center gap-5 px-5 py-4 text-indigo-400 transition-colors duration-300 rounded-lg group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-blue-400">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                class="flex-shrink-0 w-6 h-6 text-indigo-400 transition-colors duration-300 stroke-current group-hover:text-white drop-shadow fill-none"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M8 12h8" />
                                <path d="M12 8v8" />
                            </svg>
                            <span class="hidden pr-1 font-medium transition-all duration-300 select-none lg:block group-hover:text-white drop-shadow">
                                Agregar modalidad
                            </span>
                        </button>
                    </div>
                </div>

                <section id="modalities-list" class="flex flex-wrap gap-6"></section>
            </main>

            <template id="tmpl-modality-card">
                <div class="bg-gradient-to-tr from-[rgb(var(--card-from))] to-[rgb(var(--card-to))] rounded-lg shadow p-6 w-80 flex flex-col justify-between">
                    <h3 id="modality-name" class="mb-1 font-semibold text-indigo-700"></h3>
                </div>
            </template>

            <template id="tmpl-add-modality">
                <form id="modality-form" novalidate class="flex flex-col max-w-md px-6 mx-auto gap-14 py-14">
                    <div class="flex flex-col items-center">
                        <span class="text-3xl font-bold text-center mb-2 drop-shadow bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent select-none">
                            Nueva modalidad
                        </span>
                        <span class="text-xl font-semibold text-center drop-shadow bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent select-none">
                            Llena los campos requeridos
                        </span>
                    </div>

                    <div class="flex flex-col gap-6">
                        <input id="modality-name-input" name="modalityName" type="text"
                            class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-6 py-4 rounded-lg focus:outline-none text-indigo-500 placeholder:text-indigo-300 text-xl placeholder:italic text-shadow shadow-md border-none"
                            placeholder="Nombre de la modalidad (e.g., Presencial)" required>
                    </div>

                    <div class="flex justify-end gap-3">
                        <button type="button" id="cancel-btn"
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
        await this._setupModalitiesManagement();
    }

    async _setupModalitiesManagement() {
        const listContainer = document.querySelector('#modalities-list');
        const addBtn = document.querySelector('#add-modality-btn');

        await this._renderModalities();

        addBtn.addEventListener('click', async () => {
            const modal = new Modal({
                templateId: 'tmpl-add-modality',
                size: 'sm'
            });
            await modal.open();

            this._setupModalityForm(modal);
        });
    }

    async _renderModalities() {
        try {
            const modalities = await ModalitiesService.list();
            const listContainer = document.querySelector('#modalities-list');
            listContainer.innerHTML = '';

            modalities.forEach(modality => {
                const tpl = document.querySelector('#tmpl-modality-card').content.cloneNode(true);
                tpl.querySelector('#modality-name').textContent = modality.modalityName;
                listContainer.appendChild(tpl);
            });

        } catch (error) {
            console.error('[ModalitiesInterface] Failed to load modalities:', error);
            alert('Error al cargar las modalidades');
        }
    }

    _setupModalityForm(modal) {
        modal.contentHost.querySelector('#cancel-btn')?.addEventListener('click', () => modal.close());

        modal.contentHost.querySelector('#modality-form')?.addEventListener('submit', async e => {
            e.preventDefault();
            const form = e.target;

            const data = {
                modalityName: form.modalityName.value.trim()
            };

            if (!data.modalityName) {
                alert('Por favor completa los campos obligatorios');
                return;
            }

            try {
                await ModalitiesService.create(data);
                alert('Modalidad agregada correctamente');
                modal.close();
                await this._renderModalities();
            } catch (error) {
                console.error('[ModalitiesInterface] Failed to create modality:', error);
                alert('Error al agregar modalidad');
            }
        });
    }
}