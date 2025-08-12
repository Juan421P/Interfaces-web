import { ROUTES } from './../../../js/helpers/routes.js';
import { stripScripts } from './../../../js/helpers/common-methods.js';
import { CareersService } from '../../../js/services/careers.js';
import { DepartmentsService } from '../../../js/services/departments.js';
import { FacultiesService } from '../../../js/services/faculties.js';

export async function init() {
    const toast = new (await import(ROUTES.components.toast.js)).Toast();
    await toast.init();

    const section = document.querySelector('#career-list');
    const addBtn = document.querySelector('#add-career-btn');
    const tmpl = document.querySelector('#tmpl-add-career');
    const [careers, departments, faculties] = await Promise.all([
        CareersService.list(),
        DepartmentsService.list(),
        FacultiesService.list()
    ]);

    function renderCareers() {
        section.innerHTML = '';
        careers.forEach(career => {
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
            section.appendChild(card);
        });
    }

    function openForm() {
        const modal = tmpl.content.cloneNode(true);
        const main = document.querySelector('main');
        main.appendChild(modal);

        const form = main.querySelector('#career-form');
        form.addEventListener('submit', e => {
            e.preventDefault();
            toast.show('Carrera guardada correctamente', 'success');
            main.querySelector('#career-form').remove();
        });

        main.querySelector('#cancel-btn').addEventListener('click', () => {
            main.querySelector('#career-form').remove();
        });
    }

    addBtn.addEventListener('click', openForm);

    renderCareers();
}