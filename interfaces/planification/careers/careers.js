import { ROUTES } from './../../../js/helpers/routes.js';
import { stripScripts } from './../../../js/helpers/common-methods.js';

export async function init() {
    const toast = new (await import(ROUTES.components.toast.js)).Toast();
    await toast.init();

    const section = document.querySelector('#career-list');
    const addBtn = document.querySelector('#add-career-btn');
    const tmpl = document.querySelector('#tmpl-add-career');
    let careers = [];

    careers = [
        {
            careerName: 'Ingeniería en Sistemas',
            careerCode: 'INS-01',
            minPassingScore: 6.0,
            totalValueUnits: 180,
            description: 'Carrera enfocada en desarrollo de software y sistemas.'
        },
        {
            careerName: 'Arquitectura',
            careerCode: 'ARQ-02',
            minPassingScore: 6.5,
            totalValueUnits: 200,
            description: 'Formación en diseño y construcción de espacios habitables.'
        }
    ];

    function renderCareers() {
        section.innerHTML = '';
        careers.forEach(career => {
            const card = document.createElement('div');
            card.className =
                'w-72 p-6 bg-gradient-to-tr from-indigo-50 to-blue-50 rounded-xl shadow hover:shadow-lg hover:scale-[1.015] transition-transform duration-300 cursor-pointer';
            card.innerHTML = `
                <h2 class="font-bold bg-gradient-to-tr from-indigo-500 to-blue-500 bg-clip-text text-transparent text-lg drop-shadow">${career.careerName}</h2>
                <p class="text-sm bg-gradient-to-tr from-indigo-400 to-blue-400 bg-clip-text text-transparent italic mb-2 drop-shadow">${career.careerCode}</p>
                <p class="text-sm bg-gradient-to-tr from-indigo-400 to-blue-400 bg-clip-text text-transparent mb-2 drop-shadow">${career.description || 'Sin descripción'}</p>
                <p class="text-sm bg-gradient-to-tr from-indigo-400 to-blue-400 bg-clip-text text-transparent drop-shadow">Nota mínima: ${career.minPassingScore}</p>
                <p class="text-sm bg-gradient-to-tr from-indigo-400 to-blue-400 bg-clip-text text-transparent drop-shadow">UV Totales: ${career.totalValueUnits}</p>
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