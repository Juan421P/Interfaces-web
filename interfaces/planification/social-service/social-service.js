import { ROUTES } from './../../../js/lib/routes.js';
import { stripScripts } from './../../../js/lib/common-methods.js';

export async function init() {
    const toast = new (await import(ROUTES.components.toast.js)).Toast();
    await toast.init();

    const section = document.querySelector('#service-list');
    const addBtn = document.querySelector('#add-service-btn');
    const tmpl = document.querySelector('#tmpl-add-service');
    let services = [];

    services = [
        {
            socialServiceProjectName: 'Proyecto Verde',
            description: 'Reforestación de zonas afectadas.'
        },
        {
            socialServiceProjectName: 'Alfabetización Rural',
            description: 'Apoyo educativo en comunidades rurales.'
        }
    ];

    function renderServices() {
        section.innerHTML = '';
        services.forEach(service => {
            const card = document.createElement('div');
            card.className =
                'w-72 p-6 bg-gradient-to-tr from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] rounded-xl shadow hover:shadow-lg hover:scale-[1.015] transition-transform duration-300 cursor-pointer';
            card.innerHTML = `
                <h2 class="font-bold bg-gradient-to-tr from-[rgb(var(--body-from))]0 to-[rgb(var(--body-to))]0 bg-clip-text text-transparent text-lg drop-shadow mb-2">${service.socialServiceProjectName}</h2>
                <p class="text-sm bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow">${service.description || 'Sin descripción'}</p>
            `;
            section.appendChild(card);
        });
    }

    function openForm() {
        const modal = tmpl.content.cloneNode(true);
        const main = document.querySelector('main');
        main.appendChild(modal);

        const form = main.querySelector('#service-form');
        form.addEventListener('submit', e => {
            e.preventDefault();
            toast.show('Proyecto de servicio social guardado', 'success');
            main.querySelector('#service-form').remove();
        });

        main.querySelector('#cancel-btn').addEventListener('click', () => {
            main.querySelector('#service-form').remove();
        });
    }

    addBtn.addEventListener('click', openForm);

    renderServices();
}
