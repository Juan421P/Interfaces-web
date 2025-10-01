import { Interface } from './../../base/interface.js';

import { UniversitiesService } from './../../../js/services/universities.service.js';
import {
    Modal,
    Toast
} from './../../../components/components.js';

export default class UniversitiesInterface extends Interface {

    static getTemplate() {
        return `
<main class="flex flex-col min-h-screen p-10 pb-56 space-y-8 md:ml-80">

    <div class="bg-gradient-to-bl from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] shadow-md rounded-xl p-6 flex items-center gap-6">

        <div id="profile-avatar-main"
            class="flex items-center justify-center flex-shrink-0 overflow-hidden rounded-full w-14 h-14 bg-gradient-to-tr from-indigo-100 to-blue-100 drop-shadow">

            <img id="university-logo" src="" alt="Logo de la universidad"
                class="object-cover w-full h-full transition-transform duration-200 hover:cursor-pointer hover:scale-105" />

        </div>

        <div class="flex-shrink-1">

            <p id="university-name"
                class="text-lg font-semibold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow select-none">

                —

            </p>

            <p id="university-rector"
                class="text-sm bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow select-none">

                —

            </p>

            <a id="university-web" href="#" target="_blank"
                class="relative inline-block text-transparent bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-indigo-300 after:to-blue-300 after:transition-all duration-300 after:ease-in-out hover:after:w-full cursor-pointer text-xs mt-1 drop-shadow select-none">

                —

            </a>

        </div>

        <div class="ml-auto">

            <button id="edit-university-btn" type="button"
                class="flex items-center gap-3 px-4 py-2 text-indigo-400 transition duration-300 rounded-lg hover:drop-shadow group hover:bg-gradient-to-r hover:from-indigo-400 hover:to-blue-400">

                <svg xmlns="http://www.w3.org/2000/svg"
                    class="flex-shrink-0 w-5 h-5 text-indigo-400 transition-colors group-hover:text-white"
                    stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    viewBox="0 0 24 24">

                    <path d="M12 20h9" />

                    <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />

                </svg>

                <span class="font-medium select-none group-hover:text-white">
                    Editar
                </span>

            </button>

        </div>

    </div>

    <section>
        <button type="button" data-toggle="collapse-sub" data-target="#faculties-list"
            class="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 drop-shadow group">

            <p
                class="bg-gradient-to-r from-[rgb(var(--body-from))]0 to-[rgb(var(--body-to))]0 bg-clip-text text-transparent select-none drop-shadow">
                Facultades registradas:
                <span id="faculty-count">—</span>
            </p>

            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" class="w-5 h-5 text-indigo-400 transition-transform duration-300">
                <path d="M6 9l6 6 6-6" />
            </svg>
        </button>
        <ul id="faculties-list" class="hidden pl-5 mt-2 space-y-1 text-sm list-disc"></ul>
    </section>

    <section class="space-y-2">
        <p class="bg-gradient-to-r from-[rgb(var(--body-from))]0 to-[rgb(var(--body-to))]0 bg-clip-text text-transparent select-none drop-shadow">
            Localidades registradas:
            <span id="locality-count">—</span>
        </p>
        <p class="bg-gradient-to-r from-[rgb(var(--body-from))]0 to-[rgb(var(--body-to))]0 bg-clip-text text-transparent select-none drop-shadow">
            Localidad principal (sede):
            <span id="main-locality">—</span>
        </p>
    </section>
</main>

<template id="tmpl-edit-university">
    <form id="edit-university-form" novalidate class="flex flex-col max-w-md px-6 mx-auto gap-14 py-14">
        <div class="flex flex-col items-center">
            <span class="text-3xl font-bold text-center mb-2 drop-shadow bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent select-none">
                Editar Universidad
            </span>
            <span class="text-xl font-semibold text-center drop-shadow bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent select-none">
                Modifica los datos requeridos
            </span>
        </div>
        <div class="flex flex-col gap-6">
            <input id="university-name-mdl" type="text" class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-6 py-4 rounded-lg focus:outline-none text-indigo-500 placeholder:text-indigo-300 text-xl placeholder:italic text-shadow shadow-md border-none" placeholder="Nombre de la universidad" required>
            <input id="university-rector-mdl" type="text" class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-6 py-4 rounded-lg focus:outline-none text-indigo-500 placeholder:text-indigo-300 text-xl placeholder:italic text-shadow shadow-md border-none" placeholder="Rector" required>
            <input id="university-web-mdl" type="url" class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-6 py-4 rounded-lg focus:outline-none text-indigo-500 placeholder:text-indigo-300 text-xl placeholder:italic text-shadow shadow-md border-none" placeholder="Sitio web (https://...)" required>
            <input id="university-logo-mdl" type="url" class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-6 py-4 rounded-lg focus:outline-none text-indigo-500 placeholder:text-indigo-300 text-xl placeholder:italic text-shadow shadow-md border-none" placeholder="URL del logo" required>
        </div>
        <div class="flex justify-end gap-3">
            <button type="button" id="cancel-btn" class="p-4 bg-gradient-to-tr from-indigo-100 to-blue-100 text-indigo-400 hover:scale-[1.015] hover:from-indigo-200 hover:to-blue-200 rounded-xl font-medium shadow-md transition-all text-indigo-400">
                Cancelar
            </button>
            <button type="submit" class="p-4 bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] text-white drop-shadow rounded-xl font-medium shadow-md hover:from-[rgb(var(--body-from))]0 hover:to-[rgb(var(--body-to))]0 hover:scale-[1.015] transition-all">
                Guardar
            </button>
        </div>
    </form>
</template>

<template id="tmpl-image-preview">
    <div class="flex items-center justify-center min-h-[70vh]">
        <img id="modal-image-preview" src="" class="rounded-xl max-h-[70vh] object-contain shadow-xl" />
    </div>
</template>
        `;
    }

    async init() {
        this.toast = new Toast();
        await this.toast.init();
        await this._loadUniversity();

        document.querySelector('#edit-university-btn')?.addEventListener('click', async () => {
            const modal = new Modal({ templateId: 'tmpl-edit-university', size: 'sm' });
            await modal.open();
            this._fillEditForm();
            document.querySelector('#edit-university-form')?.addEventListener('submit', async e => {
                e.preventDefault();
                const form = e.target;
                const updated = {
                    universityName: form.querySelector('#university-name-mdl').value,
                    rector: form.querySelector('#university-rector-mdl').value,
                    webPage: form.querySelector('#university-web-mdl').value,
                    imageUrlUniversities: form.querySelector('#university-logo-mdl').value
                };
                await UniversitiesService.update(updated); //aca
                this.toast.show('Cambios guardados', 3000);
                modal.close();
                this._loadUniversity();
            });
        });

        document.querySelector('#university-logo')?.addEventListener('click', () => {
            const src = document.querySelector('#university-logo').src;
            if (src) {
                const modal = new Modal({ templateId: 'tmpl-image-preview', size: 'lg' });
                document.querySelector('#modal-image-preview').src = src;
                modal.open();
            }
        });
    }

    async _loadUniversity() {
        try {
            const universities = await UniversitiesService.getAll();//aca
            const data = universities[0]; // mock: solo mostramos la primera
            if (!data) return;

            document.querySelector('#university-name').textContent = data.universityName || '—';
            document.querySelector('#university-rector').textContent = `Rector: ${data.rector || '—'}`;
            const web = document.querySelector('#university-web');
            web.textContent = data.webPage || '—';
            web.href = data.webPage || '#';
            document.querySelector('#university-logo').src = data.imageUrlUniversities || '';
        } catch (err) {
            console.error('[UniversitiesInterface] Error al cargar universidad:', err);
            this.toast.show('Error al cargar universidad');
        }
    }

    _fillEditForm() {
        const form = document.querySelector('#edit-university-form');
        form.querySelector('#university-name-mdl').value = document.querySelector('#university-name').textContent || '';
        form.querySelector('#university-rector-mdl').value = document.querySelector('#university-rector').textContent.replace('Rector: ', '') || '';
        form.querySelector('#university-web-mdl').value = document.querySelector('#university-web').href || '';
        form.querySelector('#university-logo-mdl').value = document.querySelector('#university-logo').src || '';
    }
}
