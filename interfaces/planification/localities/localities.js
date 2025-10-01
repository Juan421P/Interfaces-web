import { Interface } from './../../base/interface.js';

import { LocalitiesService } from './../../../js/services/users.service.js';
import {
    Modal,
    Toast,
    ContextMenu
} from './../../../components/components.js';

export default class LocalitiesInterface extends Interface {

    static getTemplate() {
        return `
<main class="flex flex-col min-h-screen p-10 md:ml-80">

    <div class="flex items-center justify-between mb-10">
        <h1
            class="text-2xl font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow select-none">
            Localidades
        </h1>
        <div
            class="block transition-shadow duration-300 bg-transparent group rounded-xl hover:bg-white hover:shadow-lg">
            <button id="add-locality-btn" type="button"
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
                    Agregar localidad
                </span>
            </button>
        </div>
    </div>

    <section id="localities-list" class="flex flex-wrap gap-6"></section>
</main>

<template id="tmpl-locality-card">
    <div class="bg-gradient-to-tr from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] rounded-lg shadow p-6 w-80 flex flex-col justify-between cursor-pointer locality-card">
        <h3 id="locality-address" class="mb-1 font-semibold text-indigo-700"></h3>
        <p class="mb-1 text-sm text-indigo-500">Teléfono: <span id="locality-phone"></span></p>
        <div class="mt-4">
            <span id="main-locality-badge"
                class="hidden inline-block mt-1 px-2 py-0.5 text-xs rounded bg-blue-400 text-white font-semibold select-none">
                Sede principal
            </span>
        </div>
    </div>
</template>

<template id="tmpl-add-locality">
    <form id="locality-form" novalidate class="flex flex-col max-w-md px-6 mx-auto gap-14 py-14">
        <div class="flex flex-col items-center">
            <span class="text-3xl font-bold text-center mb-2 drop-shadow bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent select-none">
                Nueva localidad
            </span>
            <span class="text-xl font-semibold text-center drop-shadow bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent select-none">
                Llena los campos requeridos
            </span>
        </div>
        <div class="flex flex-col gap-6">
            <input id="locality-address-input" name="address" type="text"
                class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-6 py-4 rounded-lg focus:outline-none text-indigo-500 placeholder:text-indigo-300 text-xl placeholder:italic text-shadow shadow-md border-none"
                placeholder="Dirección de la localidad" required>
            <input id="locality-phone-input" name="phoneNumber" type="tel"
                class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-6 py-4 rounded-lg focus:outline-none text-indigo-500 placeholder:text-indigo-300 text-xl placeholder:italic text-shadow shadow-md border-none"
                placeholder="Teléfono de contacto">
            <label class="flex items-center gap-3 text-indigo-500 select-none">
                <input id="locality-main-input" type="checkbox" name="isMainLocality"
                    class="w-5 h-5 text-indigo-400 rounded focus:ring-indigo-400">
                <span class="text-sm">¿Es la sede principal?</span>
            </label>
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
        await this._renderLocalities();

        document.querySelector('#add-locality-btn')?.addEventListener('click', async () => {
            this._openLocalityModal();
        });
    }

    async _renderLocalities() {
        try {
            const localities = await LocalitiesService.getAll();
            const list = document.querySelector('#localities-list');
            list.innerHTML = '';

            localities.forEach(loc => {
                const tpl = document.querySelector('#tmpl-locality-card').content.cloneNode(true);
                tpl.querySelector('#locality-address').textContent = loc.address;
                tpl.querySelector('#locality-phone').textContent = loc.phoneNumber || '-';
                if (loc.isMainLocality === true || loc.isMainLocality === '1') {
                    tpl.querySelector('#main-locality-badge').classList.remove('hidden');
                }

                const card = tpl.querySelector('.locality-card');
                card.addEventListener('contextmenu', e => {
                    e.preventDefault();
                    const menu = new ContextMenu({
                        actions: [
                            {
                                label: 'Editar',
                                onClick: () => this._openLocalityModal(loc)
                            },
                            {
                                label: 'Eliminar',
                                className: 'text-red-500',
                                onClick: async () => {
                                    if (confirm('¿Eliminar esta localidad?')) {
                                        await LocalitiesService.delete(loc.localityID);
                                        this.toast.show('Localidad eliminada', 3000);
                                        this._renderLocalities();
                                    }
                                }
                            }
                        ]
                    });
                    menu.open(e.pageX, e.pageY, menu.actions);
                });

                list.appendChild(tpl);
            });

        } catch (err) {
            console.error('[LocalitiesInterface] Error al cargar localidades:', err);
            this.toast.show('Error al cargar localidades');
        }
    }

    async _openLocalityModal(loc = null) {
        const modal = new Modal({ templateId: 'tmpl-add-locality', size: 'md' });
        await modal.open();

        const form = modal.contentHost.querySelector('#locality-form');
        const cancelBtn = modal.contentHost.querySelector('#cancel-btn');

        if (loc) {
            form.querySelector('#locality-address-input').value = loc.address || '';
            form.querySelector('#locality-phone-input').value = loc.phoneNumber || '';
            form.querySelector('#locality-main-input').checked = (loc.isMainLocality === true || loc.isMainLocality === '1');
        }

        cancelBtn?.addEventListener('click', () => modal.close());

        form.addEventListener('submit', async e => {
            e.preventDefault();

            const data = {
                localityID: loc?.localityID,
                address: form.address.value.trim(),
                phoneNumber: form.phoneNumber.value.trim(),
                isMainLocality: form.isMainLocality.checked
            };

            if (!data.address) {
                this.toast.show('Por favor completa la dirección', 3000);
                return;
            }

            try {
                if (loc) {
                    await LocalitiesService.update(data);
                    this.toast.show('Localidad actualizada', 3000);
                } else {
                    await LocalitiesService.create(data);
                    this.toast.show('Localidad agregada correctamente', 3000);
                }
                modal.close();
                this._renderLocalities();
            } catch (error) {
                console.error('[LocalitiesInterface] Error al guardar localidad:', error);
                this.toast.show('Error al guardar localidad');
            }
        });
    }
}
