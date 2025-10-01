import { Interface } from './../../base/interface.js';
import { CareersService } from './../../../js/services/careers.service.js';
import { DepartmentsService } from './../../../js/services/departments.service.js';
import { FacultiesService } from './../../../js/services/faculties.service.js';

export default class CareersInterface extends Interface {

    static getTemplate() {
        return `
            <main class="flex flex-col min-h-screen p-10 md:ml-80">
                <div class="flex items-center justify-between mb-10">
                    <h1
                        class="text-2xl font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow select-none">
                        Carreras
                    </h1>
                    <div
                        class="block transition-shadow duration-300 bg-transparent group rounded-xl hover:bg-white hover:shadow-lg">
                        <button id="add-career-btn" type="button"
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
                                Agregar carrera
                            </span>
                        </button>
                    </div>
                </div>

                <section id="career-list" class="flex flex-wrap gap-6"></section>
            </main>

            <template id="tmpl-add-career">
                <form id="career-form" novalidate class="flex flex-col max-w-md px-6 mx-auto gap-14 py-14">
                    <div class="flex flex-col items-center">
                        <span
                            class="text-3xl font-bold text-center mb-2 drop-shadow bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent select-none">
                            Nueva carrera
                        </span>
                        <span
                            class="text-xl font-semibold text-center drop-shadow bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent select-none">
                            Llena los campos requeridos
                        </span>
                    </div>

                    <div class="flex flex-col gap-6">
                        <input id="career-name" name="name" type="text" placeholder="Nombre de la carrera"
                            class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-6 py-4 rounded-lg focus:outline-none text-indigo-500 placeholder:text-indigo-300 text-xl placeholder:italic text-shadow shadow-md border-none"
                            required>

                        <input id="career-code" name="code" type="text" placeholder="Código de carrera"
                            class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-6 py-4 rounded-lg focus:outline-none text-indigo-500 placeholder:text-indigo-300 text-xl placeholder:italic text-shadow shadow-md border-none">

                        <textarea id="career-description" name="description" placeholder="Descripción"
                            class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-6 py-4 rounded-lg focus:outline-none text-indigo-500 placeholder:text-indigo-300 text-xl placeholder:italic text-shadow shadow-md border-none"></textarea>

                        <input id="career-score" name="minPassingScore" type="number" placeholder="Nota mínima de aprobación"
                            class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-6 py-4 rounded-lg focus:outline-none text-indigo-500 placeholder:text-indigo-300 text-xl placeholder:italic text-shadow shadow-md border-none">

                        <input id="career-value" name="totalValueUnits" type="number" placeholder="Total de unidades valorativas"
                            class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-6 py-4 rounded-lg focus:outline-none text-indigo-500 placeholder:text-indigo-300 text-xl placeholder:italic text-shadow shadow-md border-none">
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
        await (new Toast()).init();

        this.section = document.getElementById('career-list');
        this.addBtn = document.getElementById('add-career-btn');
        this.tmpl = document.getElementById('tmpl-add-career');

        const [careers, departments, faculties] = await Promise.all([
            CareersService.list(),
            DepartmentsService.list(),
            FacultiesService.list()
        ]);

        this.careers = careers;
        this.departments = departments;
        this.faculties = faculties;

        this._renderCareers();

        if (this.addBtn) {
            this.addBtn.addEventListener('click', () => this._openForm());
        }
    }

    _renderCareers() {
        this.section.innerHTML = '';
        this.careers.forEach(career => {
            const card = document.createElement('div');
            card.className = 'w-72 p-6 bg-gradient-to-tr from-[rgb(var(--card-from))] to-[rgb(var(--card-to))] rounded-xl shadow hover:shadow-lg hover:scale-[1.015] transition-transform duration-300 cursor-pointer flex flex-col justify-between';
            card.innerHTML = `
                <div class="mb-10">
                    <h2 class="font-bold bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent text-lg">${career.careerName}</h2>
                    <p class="text-md font-bold text-sm bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent italic mb-2">ID ${career.careerCode}</p>
                    <p class="text-sm bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent mb-2">${career.description || 'Sin descripción'}</p>
                    <p class="text-sm bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent">Nota mínima: ${career.minPassingScore}</p>
                    <p class="text-sm bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent">UV Totales: ${career.totalValueUnits}</p>
                </div>
                <div>
                    <span class="inline-block mt-1 px-2 py-0.5 text-xs rounded bg-indigo-400 text-white font-semibold select-none">Departamento</span>
                    <span class="inline-block mt-1 px-2 py-0.5 text-xs rounded bg-indigo-400 text-white font-semibold select-none">Facultad</span>
                    <span class="inline-block mt-1 px-2 py-0.5 text-xs rounded bg-indigo-400 text-white font-semibold select-none">Localidad</span>
                    <span class="inline-block mt-1 px-2 py-0.5 text-xs rounded bg-indigo-400 text-white font-semibold select-none">Pensum</span>
                </div>
            `;
            this.section.appendChild(card);
        });
    }

    _openForm() {
        const modal = this.tmpl.content.cloneNode(true);
        const main = document.querySelector('main');
        main.appendChild(modal);

        const form = main.querySelector('#career-form');
        form.addEventListener('submit', e => {
            e.preventDefault();
            this.toast.show('Carrera guardada correctamente', 'success');
            form.remove();
        });

        main.querySelector('#cancel-btn').addEventListener('click', () => {
            form.remove();
        });
    }
}
