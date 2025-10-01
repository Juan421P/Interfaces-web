import { Interface } from './../../base/interface.js';
import { DepartmentsService } from './../../../js/services/departments.service.js';
import { FacultiesService } from './../../../js/services/faculties.service.js';
import { Toast } from './../../../components/components.js';

export default class DepartmentsInterface extends Interface {

    static getTemplate() {
        return `
            <main class="flex flex-col min-h-screen p-10 md:ml-80">

                <div class="flex items-center justify-between mb-10">
                    <h1
                        class="text-2xl font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow select-none">
                        Departamentos
                    </h1>

                    <div
                        class="block transition-shadow duration-300 bg-transparent group rounded-xl hover:bg-white hover:shadow-lg">
                        <button id="add-department-btn" type="button"
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
                                Agregar departamento
                            </span>
                        </button>
                    </div>
                </div>

                <section id="department-list" class="flex flex-wrap gap-6"></section>
            </main>

            <template id="tmpl-add-department">
                <form id="department-form" novalidate class="flex flex-col max-w-md px-6 mx-auto gap-14 py-14">
                    <div class="flex flex-col items-center">
                        <span
                            class="text-3xl font-bold text-center mb-2 drop-shadow bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent select-none">
                            Nuevo departamento
                        </span>
                        <span
                            class="text-xl font-semibold text-center drop-shadow bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent select-none">
                            Llena los campos requeridos
                        </span>
                    </div>

                    <div class="flex flex-col gap-6">
                        <input id="department-name" name="name" type="text" placeholder="Nombre del departamento"
                            class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-6 py-4 rounded-lg focus:outline-none text-indigo-500 placeholder:text-indigo-300 text-xl placeholder:italic text-shadow shadow-md border-none"
                            required>

                        <input id="department-code" name="code" type="text" placeholder="Código de departamento"
                            class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-6 py-4 rounded-lg focus:outline-none text-indigo-500 placeholder:text-indigo-300 text-xl placeholder:italic text-shadow shadow-md border-none">
                    </div>

                    <div class="flex justify-end gap-3">
                        <button type="button" id="cancel-btn"
                            class="p-4 bg-gradient-to-tr from-indigo-100 to-blue-100 text-indigo-400 hover:scale-[1.015] hover:from-indigo-200 hover:to-blue-200 rounded-xl font-medium shadow-md transition-all">
                            Cancelar
                        </button>
                        <button type="submit"
                            class="p-4 bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] text-white drop-shadow rounded-xl font-medium shadow-md hover:scale-[1.015] transition-all">
                            Guardar
                        </button>
                    </div>
                </form>
            </template>
        `;
    }

    async init() {
        await (new Toast()).init();

        this.section = document.getElementById('department-list');
        this.addBtn = document.getElementById('add-department-btn');
        this.tmpl = document.getElementById('tmpl-add-department');

        const [departments, faculties] = await Promise.all([
            DepartmentsService.list(),
            FacultiesService.list()
        ]);

        this.departments = departments;
        this.faculties = faculties;

        this._renderDepartments();

        if (this.addBtn) {
            this.addBtn.addEventListener('click', () => this._openForm());
        }
    }

    _renderDepartments() {
        this.section.innerHTML = '';
        this.departments.forEach(department => {
            const card = document.createElement('div');
            card.className = 'w-72 p-6 bg-gradient-to-tr from-[rgb(var(--card-from))] to-[rgb(var(--card-to))] rounded-xl shadow hover:shadow-lg hover:scale-[1.015] transition-transform duration-300 cursor-pointer flex flex-col justify-between';
            card.innerHTML = `
                <div class="mb-10">
                    <h2 class="font-bold bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent text-lg">${department.departmentName}</h2>
                    <p class="text-md font-bold text-sm bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent italic mb-2">ID ${department.departmentCode}</p>
                </div>
                <div>
                    <span class="inline-block mt-1 px-2 py-0.5 text-xs rounded bg-indigo-400 text-white font-semibold select-none">Facultad</span>
                </div>
            `;
            this.section.appendChild(card);
        });
    }

    _openForm() {
        const modal = this.tmpl.content.cloneNode(true);
        const main = document.querySelector('main');
        main.appendChild(modal);

        const form = main.querySelector('#department-form');
        form.addEventListener('submit', e => {
            e.preventDefault();
            this.toast.show('Departamento guardado correctamente', 'success');
            form.remove();
        });

        main.querySelector('#cancel-btn').addEventListener('click', () => {
            form.remove();
        });
    }
}
