import { Interface } from './../../base/interface.js';
import { SocialServiceProjectsService } from './../../../js/services/social-service-projects.service.js';
import { Toast } from './../../../components/components.js';

export default class SocialServiceInterface extends Interface {

    static getTemplate() {
        return `
            <main class="flex flex-col min-h-screen p-10 md:ml-80">
                <div class="flex items-center justify-between mb-10">
                    <h1 class="text-2xl font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow select-none">
                        Proyectos de servicio social
                    </h1>
                    <div class="block transition-shadow duration-300 bg-transparent group rounded-xl hover:bg-white hover:shadow-lg">
                        <button id="add-service-btn" type="button" class="flex items-center gap-5 px-5 py-4 text-indigo-400 transition-colors duration-300 rounded-lg group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-blue-400">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                class="flex-shrink-0 w-6 h-6 text-indigo-400 transition-colors duration-300 stroke-current group-hover:text-white drop-shadow fill-none"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M8 12h8" />
                                <path d="M12 8v8" />
                            </svg>
                            <span class="hidden pr-1 font-medium transition-all duration-300 select-none lg:block group-hover:text-white drop-shadow">
                                Agregar proyecto
                            </span>
                        </button>
                    </div>
                </div>
                <section id="service-list" class="flex flex-wrap gap-6"></section>
            </main>
            <template id="tmpl-add-service">
                <form id="service-form" novalidate class="flex flex-col max-w-md px-6 mx-auto gap-14 py-14">
                    <div class="flex flex-col items-center">
                        <span class="text-3xl font-bold text-center mb-2 drop-shadow bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent select-none">
                            Nuevo proyecto
                        </span>
                        <span class="text-xl font-semibold text-center drop-shadow bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent select-none">
                            Llena los campos requeridos
                        </span>
                    </div>
                    <div class="flex flex-col gap-6">
                        <input id="service-name" name="socialServiceProjectName" type="text" placeholder="Nombre del proyecto"
                            class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-6 py-4 rounded-lg focus:outline-none text-indigo-500 placeholder:text-indigo-300 text-xl placeholder:italic text-shadow shadow-md border-none"
                            required>
                        <textarea id="service-description" name="description" placeholder="Descripción"
                            class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-6 py-4 rounded-lg focus:outline-none text-indigo-500 placeholder:text-indigo-300 text-xl placeholder:italic text-shadow shadow-md border-none"></textarea>
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
        this.toast = new Toast();
        await this.toast.init();

        await this._setupServiceManagement();
    }

    async _setupServiceManagement() {
        const section = document.querySelector('#service-list');
        const addBtn = document.querySelector('#add-service-btn');

        await this._renderServices();

        addBtn.addEventListener('click', () => {
            this._openForm();
        });
    }

    async _renderServices() {
        try {
            const services = await SocialServiceProjectsService.list();
            const section = document.querySelector('#service-list');
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

        } catch (error) {
            console.error('[SocialServiceInterface] Failed to load services:', error);
            this.toast.show('Error al cargar los proyectos de servicio social');
        }
    }

    _openForm() {
        const modal = document.querySelector('#tmpl-add-service').content.cloneNode(true);
        const main = document.querySelector('main');
        main.appendChild(modal);

        const form = main.querySelector('#service-form');
        form.addEventListener('submit', async e => {
            e.preventDefault();

            const formData = new FormData(form);
            const data = {
                socialServiceProjectName: formData.get('socialServiceProjectName').trim(),
                description: formData.get('description').trim()
            };

            if (!data.socialServiceProjectName) {
                this.toast.show('Por favor ingresa el nombre del proyecto');
                return;
            }

            try {
                await SocialServiceProjectsService.create(data);
                this.toast.show('Proyecto de servicio social guardado');
                main.querySelector('#service-form').remove();
                await this._renderServices();
            } catch (error) {
                console.error('[SocialServiceInterface] Failed to create service project:', error);
                this.toast.show('Error al guardar el proyecto');
            }
        });

        main.querySelector('#cancel-btn').addEventListener('click', () => {
            main.querySelector('#service-form').remove();
        });
    }
}