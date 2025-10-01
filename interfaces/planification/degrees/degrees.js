/*import { Interface } from './../../base/interface.js';
import { DegreeTypeService } from '../../../js/services/titles.service.js';
import { Toast } from '../../../components/components.js';
import { Modal } from '../../../components/components.js';

export default class DegreeTypeInterface extends Interface {

    static getTemplate() {
        return `
            <main class="flex flex-col min-h-screen p-10 md:ml-80">
                <div class="flex items-center justify-between mb-10">
                    <h1
                        class="text-2xl font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow select-none">
                        Grados
                    </h1>
                    <div class="block transition-shadow group rounded-xl hover:bg-white hover:shadow-lg">
                        <button id="add-grade-btn" type="button"
                            class="flex items-center gap-5 px-5 py-4 text-indigo-400 rounded-lg group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-blue-400">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-indigo-400 group-hover:text-white"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M8 12h8" />
                            <path d="M12 8v8" />
                        </svg>
                    <span class="hidden font-medium select-none lg:block group-hover:text-white drop-shadow">Agregar
                        grado</span>
                    </button>
                </div>
            </div>
            <section id="grades-list" class="flex flex-wrap gap-6"></section>
        </main>

        <template id="tmpl-grade-card">
            <div class="bg-gradient-to-tr from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] rounded-lg shadow p-6 w-64">
                <h3 class="mb-1 font-semibold text-indigo-700" id="grade-name"></h3>
            </div>
        </template>

        <template id="tmpl-add-grade">
            <form id="grade-form" class="flex flex-col max-w-md gap-10 px-6 py-10 mx-auto">
                <h2
                    class="text-2xl font-bold text-center bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent select-none">
                    Nuevo grado
                </h2>
                <input id="grade-name-input" type="text"
                    class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-6 py-4 rounded-lg text-indigo-500 shadow-md placeholder:text-indigo-300"
                    placeholder="Ej: Pregrado, Posgrado" required>
                <div class="flex justify-end gap-3">
                    <button type="button" id="cancel-btn"
                        class="p-4 text-indigo-400 shadow-md bg-gradient-to-tr from-indigo-100 to-blue-100 rounded-xl">
                        Cancelar
                    </button>
                    <button type="submit"
                        class="p-4 bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] text-white rounded-xl shadow-md">
                        Guardar
                    </button>
                </div>
            </form>
        </template>
        `;
    }

    async init(){
        this.toast = new Toast();
        await this.toast.init();
        await this._render();
        this._bindEvents();
    }

    async _render(){
        try {
            const grades = await DegreeTypeService.list();
            const list = document.getElementById('grades-list');
            list.innerHTML = '';

            grades.forEach(g => {
                const tpl = document.getElementById('tmpl-grade-card').content.cloneNode(true);
                tpl.querySelector('#grade-name').textContent = g.academicLevelName;
                list.appendChild(tpl);
            });

        } catch (error) {
            console.error('[DegreeTypeInterface] Error al renderizar:', error);
            this.toast.show('No se pudieron cargar los grados', 4000);
        }
    }

    _bindEvents() {
        const addBtn = document.getElementById('add-grade-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this._openAddModal());
        }
    }

    async _openAddModal() {
        const modal = new Modal({ templateId: 'tmpl-add-grade', size: 'md' });
        await modal.open();

        modal.contentHost.querySelector('#cancel-btn').addEventListener('click', () => modal.close());

        modal.contentHost.querySelector('#grade-form').addEventListener('submit', async e => {
            e.preventDefault();
            const name = e.target.querySelector('#grade-name-input').value.trim();

            if (!name) {
                return this.toast.show('El nombre es obligatorio', 5000);
            }

            try {
                await DegreeTypeService.create({ academicLevelName: name })
                this.toast.show('Grado agregado correctamente');
                modal.close();
                await this._render();
            } catch {
                this.toast.show('Error al agregar grado');
            }
        });
    }
}
/*export async function init() {
    const { Modal } = await import(ROUTES.components.modal.js);
    const toast = new Toast();
    await toast.init();

    const list = document.querySelector('#grades-list');
    const addBtn = document.querySelector('#add-grade-btn');

    async function render() {
        const grades = await GradesService.list();
        list.innerHTML = '';
        grades.forEach(g => {
            const tpl = document.querySelector('#tmpl-grade-card').content.cloneNode(true);
            tpl.querySelector('#grade-name').textContent = g.academicLevelName;
            list.appendChild(tpl);
        });
    }

    addBtn.addEventListener('click', async () => {
        const modal = new Modal({ templateId: 'tmpl-add-grade', size: 'md' });
        await modal.open();

        modal.contentHost.querySelector('#cancel-btn').addEventListener('click', () => modal.close());
        modal.contentHost.querySelector('#grade-form').addEventListener('submit', async e => {
            e.preventDefault();
            const name = e.target.querySelector('#grade-name-input').value.trim();
            if (!name) return toast.show('El nombre es obligatorio', 5000);

            try {
                await GradesService.create({ academicLevelName: name });
                toast.show('Grado agregado correctamente');
                modal.close();
                await render();
            } catch {
                toast.show('Error al agregar grado');
            }
        });
    });

    await render();
}*/