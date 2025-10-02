import { Modal } from "../../../components/components.js";
import { AcademicLevelService } from "../../../js/services/academic-levels.service";
import { Interface } from "../../base/interface";
import { Toast } from "../../../components/components.js";

export default class DegreesInterface extends Interface{

    static getTemplate(){
        return`
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
        `
    }

        async init() {
        this.toast = new Toast();
        await this.toast.init();

        this.service = new AcademicLevelService();

        await this._loadData();
        this._bindCreateButton();
    }

    async _loadData() {
        try {
            const levels = await this.service.getAll();
            const container = document.getElementById('academic-levels-container');
            if (!container) return;

            container.innerHTML = levels.map(level => `
                <div class="bg-gradient-to-br from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] rounded-xl p-6 shadow-md flex flex-col justify-between">
                    <div>
                        <h2 class="text-lg font-bold text-indigo-700">${level.academicLevelName}</h2>
                    </div>
                    <div class="flex justify-end gap-3 mt-4">
                        <button class="edit-academic-level-btn p-3 bg-indigo-100 text-indigo-400 rounded-xl shadow-md" data-id="${level.academicLevelID}">Editar</button>
                        <button class="delete-academic-level-btn p-3 bg-red-100 text-red-400 rounded-xl shadow-md" data-id="${level.academicLevelID}">Eliminar</button>
                    </div>
                </div>
            `).join('');

            this._bindLevelButtons();
        } catch (err) {
            this.toast.show('Error al cargar niveles académicos');
            console.error(err);
        }
    }

    _bindCreateButton() {
        const btn = document.getElementById('create-academic-level-btn');
        if (!btn) return;

        btn.addEventListener('click', async () => {
            const modal = new Modal({ templateId: 'tmpl-create-academic-level', size: 'sm' });
            await modal._open();

            const form = document.getElementById('academic-level-form');
            const cancelBtn = document.getElementById('cancel-academic-level-btn');
            if (!form || !cancelBtn) return;

            cancelBtn.addEventListener('click', () => modal.close());

            form.addEventListener('submit', async e => {
                e.preventDefault();
                const name = document.getElementById('academic-level-name').value.trim();
                if (!name) return this.toast.show('El nombre es obligatorio', 5000);

                try {
                    await this.service.create({ academicLevelName: name });
                    this.toast.show('Nivel académico creado correctamente');
                    modal.close();
                    await this._loadData();
                } catch (err) {
                    console.error(err);
                    this.toast.show('Error al crear nivel académico');
                }
            });
        });
    }

    _bindLevelButtons() {
        document.querySelectorAll('.edit-academic-level-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                const levels = await this.service.getAll();
                const level = levels.find(l => l.academicLevelID == id);
                if (!level) return;

                const modal = new Modal({ templateId: 'tmpl-create-academic-level', size: 'sm' });
                await modal._open();

                document.getElementById('academic-level-name').value = level.academicLevelName;

                document.getElementById('cancel-academic-level-btn').addEventListener('click', () => modal.close());

                document.getElementById('academic-level-form').addEventListener('submit', async e => {
                    e.preventDefault();
                    const name = document.getElementById('academic-level-name').value.trim();
                    if (!name) return this.toast.show('El nombre es obligatorio', 5000);

                    try {
                        await this.service.update({ academicLevelID: id, academicLevelName: name });
                        this.toast.show('Nivel académico actualizado correctamente');
                        modal.close();
                        await this._loadData();
                    } catch (err) {
                        console.error(err);
                        this.toast.show('Error al actualizar nivel académico');
                    }
                });
            });
        });

        document.querySelectorAll('.delete-academic-level-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                try {
                    await this.service.delete(id);
                    this.toast.show('Nivel académico eliminado correctamente');
                    await this._loadData();
                } catch (err) {
                    console.error(err);
                    this.toast.show('Error al eliminar nivel académico');
                }
            });
        });
    }
}