import { Interface } from './../../base/interface.js';
import { CyclesService } from './../../../js/services/cycles.service.js';
import { Modal } from './../../../components/components.js';

export default class CyclesInterface extends Interface {

    static getTemplate() {
        return `
            <main class="flex flex-col min-h-screen p-10 md:ml-80">
                <div class="flex items-center justify-between mb-10">
                    <h1 class="text-2xl font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow select-none">
                        Ciclos Académicos
                    </h1>

                    <div class="block transition-shadow duration-300 bg-transparent group rounded-xl hover:bg-white hover:shadow-lg">
                        <button id="add-cycle-btn" type="button"
                            class="flex items-center gap-5 px-5 py-4 text-indigo-400 transition-colors duration-300 rounded-lg group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-blue-400">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                class="flex-shrink-0 w-6 h-6 text-indigo-400 transition-colors duration-300 stroke-current group-hover:text-white drop-shadow fill-none"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M8 12h8" />
                                <path d="M12 8v8" />
                            </svg>
                            <span class="hidden pr-1 font-medium transition-all duration-300 select-none lg:block group-hover:text-white drop-shadow">
                                Agregar ciclo
                            </span>
                        </button>
                    </div>
                </div>

                <section id="cycles-list" class="flex flex-wrap gap-6"></section>
            </main>

            <template id="tmpl-cycle-card">
                <div class="bg-gradient-to-tr from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] rounded-lg shadow p-6 w-80 flex flex-col justify-between">
                    <h3 id="cycle-label" class="mb-1 font-semibold text-indigo-700"></h3>
                    <p class="mb-1 text-sm text-indigo-500">Año: <span id="cycle-year"></span></p>
                    <p class="mt-2 text-xs text-indigo-400">Inicio: <span id="cycle-start"></span></p>
                    <p class="text-xs text-indigo-400">Fin: <span id="cycle-end"></span></p>
                </div>
            </template>

            <template id="tmpl-add-cycle">
                <form id="cycle-form" novalidate class="flex flex-col max-w-md px-6 mx-auto gap-14 py-14">
                    <div class="flex flex-col items-center">
                        <span class="text-3xl font-bold text-center mb-2 drop-shadow bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent select-none">
                            Nuevo ciclo
                        </span>
                        <span class="text-xl font-semibold text-center drop-shadow bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent select-none">
                            Llena los campos requeridos
                        </span>
                    </div>

                    <div class="flex flex-col gap-6">
                        <input id="cycle-label-input" name="label" type="text"
                            class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-6 py-4 rounded-lg focus:outline-none text-indigo-500 placeholder:text-indigo-300 text-xl placeholder:italic text-shadow shadow-md border-none"
                            placeholder="Etiqueta del ciclo (e.g., Ciclo I)" required>

                        <input id="cycle-year-input" name="year" type="number"
                            class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-6 py-4 rounded-lg focus:outline-none text-indigo-500 placeholder:text-indigo-300 text-xl placeholder:italic text-shadow shadow-md border-none"
                            placeholder="Año" required>

                        <input id="cycle-start-input" name="startDate" type="date"
                            class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-6 py-4 rounded-lg focus:outline-none text-indigo-500 text-xl shadow-md border-none"
                            required>

                        <input id="cycle-end-input" name="endDate" type="date"
                            class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-6 py-4 rounded-lg focus:outline-none text-indigo-500 text-xl shadow-md border-none"
                            required>
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
        await this._setupCyclesManagement();
    }

    async _setupCyclesManagement() {
        const listContainer = document.querySelector('#cycles-list');
        const addBtn = document.querySelector('#add-cycle-btn');

        await this._renderCycles();

        addBtn.addEventListener('click', async () => {
            const modal = new Modal({
                templateId: 'tmpl-add-cycle',
                size: 'md'
            });
            await modal.open();

            this._setupCycleForm(modal);
        });
    }

    async _renderCycles() {
        try {
            const cycles = await CyclesService.list();
            const listContainer = document.querySelector('#cycles-list');
            listContainer.innerHTML = '';

            cycles.forEach(cycle => {
                const tpl = document.querySelector('#tmpl-cycle-card').content.cloneNode(true);

                tpl.querySelector('#cycle-label').textContent = cycle.cycleLabel;
                tpl.querySelector('#cycle-year').textContent = cycle.year;
                tpl.querySelector('#cycle-start').textContent = cycle.startDate;
                tpl.querySelector('#cycle-end').textContent = cycle.endDate;

                listContainer.appendChild(tpl);
            });

        } catch (error) {
            console.error('[CyclesInterface] Failed to load cycles:', error);
            alert('Error al cargar los ciclos académicos');
        }
    }

    _setupCycleForm(modal) {
        modal.contentHost.querySelector('#cancel-btn')?.addEventListener('click', () => modal.close());

        modal.contentHost.querySelector('#cycle-form')?.addEventListener('submit', async e => {
            e.preventDefault();
            const form = e.target;

            const data = {
                cycleLabel: form.label.value.trim(),
                year: parseInt(form.year.value),
                startDate: form.startDate.value,
                endDate: form.endDate.value
            };

            if (!data.cycleLabel || !data.year || !data.startDate || !data.endDate) {
                alert('Por favor completa los campos obligatorios');
                return;
            }

            try {
                await CyclesService.create(data);
                alert('Ciclo agregado correctamente');
                modal.close();
                await this._renderCycles();
            } catch (error) {
                console.error('[CyclesInterface] Failed to create cycle:', error);
                alert('Error al agregar ciclo');
            }
        });
    }
}