import { ROUTES } from './../../../js/lib/routes.js';
import { SubjectsService } from './../../../js/services/subjects.js';

export async function init() {
    const toast = new (await import(ROUTES.components.toast.js)).Toast();
    await toast.init();

    const section = document.querySelector('#assignment-list');
    const addBtn = document.querySelector('#add-assignment-btn');
    const tmpl = document.querySelector('#tmpl-add-assignment');
    const subjects = await SubjectsService.list();

    function renderSubjects() {
        section.innerHTML = '';
        subjects.forEach(sub => {
            const card = document.createElement('div');
            card.className =
                'w-72 p-6 bg-gradient-to-tr from-[rgb(var(--card-from))] to-[rgb(var(--card-to))] rounded-xl shadow hover:shadow-lg hover:scale-[1.015] transition-transform duration-300 cursor-pointer';
            card.innerHTML = `
                <h2 class="font-bold bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent text-lg drop-shadow">${sub.subjectName}</h2>
                <p class="text-sm bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent italic mb-2 drop-shadow">${sub.subjectCode}</p>
                <p class="text-sm bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow">UV: ${sub.valueUnits}</p>
            `;
            section.appendChild(card);
        });
    }

    function openForm() {
        const modal = tmpl.content.cloneNode(true);
        const main = document.querySelector('main');
        main.appendChild(modal);

        const form = main.querySelector('#assignment-form');
        form.addEventListener('submit', e => {
            e.preventDefault();
            toast.show('Asignatura guardada correctamente', 'success');
            main.querySelector('#assignment-form').remove();
        });

        main.querySelector('#cancel-btn').addEventListener('click', () => {
            main.querySelector('#assignment-form').remove();
        });
    }

    addBtn.addEventListener('click', openForm);

    renderSubjects();
}