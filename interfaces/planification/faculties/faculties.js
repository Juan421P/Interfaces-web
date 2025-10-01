import { Interface } from './../../base/interface.js';

import { FacultiesService } from './../../../js/services/faculties.service.js';
import { LocalitiesService } from './../../../js/services/localities.service.js';
import { FacultyCorrelativesService } from './../../../js/services/faculty-correlatives.service.js';
import { FacultyLocalitiesService } from './../../../js/services/faculty-localities.service.js';

import {
    Modal,
    Toast,
    ContextMenu
} from './../../../components/components.js';

export default class FacultiesInterface extends Interface {

    static getTemplate() {
        return `
<main class="flex flex-col min-h-screen p-10 md:ml-80">

	<div class="flex items-center justify-between mb-10">

		<h1
			class="text-2xl font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow select-none">
			Facultades
		</h1>

		<div
			class="block transition-shadow duration-300 bg-transparent group rounded-xl hover:bg-white hover:shadow-lg">

			<button id="add-faculty-btn" type="button" class="flex items-center gap-5 px-5 py-4 text-indigo-400 transition-colors duration-300 rounded-lg group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-blue-400">

				<svg xmlns="http://www.w3.org/2000/svg"
					class="flex-shrink-0 w-6 h-6 text-indigo-400 transition-colors duration-300 stroke-current group-hover:text-white drop-shadow fill-none"
					stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">

					<circle cx="12" cy="12" r="10" />

					<path d="M8 12h8" />

					<path d="M12 8v8" />

				</svg>

				<span
					class="hidden pr-1 font-medium transition-all duration-300 select-none lg:block group-hover:text-white drop-shadow">

					Agregar facultad

				</span>

			</button>

		</div>

	</div>

	<section id="faculty-list" class="flex flex-wrap gap-6">
	</section>

</main>

<template id="tmpl-add-faculty">
	<form id="faculty-form" novalidate class="flex flex-col max-w-md px-6 mx-auto gap-14 py-14">

		<div class="flex flex-col items-center">

			<span
				class="text-3xl font-bold text-center mb-2 drop-shadow bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent select-none">

				Nueva facultad
			</span>

			<span
				class="text-xl font-semibold text-center drop-shadow bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent select-none">

				Llena los campos requeridos
			</span>

		</div>

		<div class="flex flex-col gap-6">

			<input id="faculty-name" name="name" type="text"
				class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-6 py-4 rounded-lg focus:outline-none text-indigo-500 placeholder:text-indigo-300 text-xl placeholder:italic text-shadow shadow-md border-none"
				placeholder="Nombre de la facultad" required>

			<input id="faculty-code" name="code" type="text"
				class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-6 py-4 rounded-lg focus:outline-none text-indigo-500 placeholder:text-indigo-300 text-xl placeholder:italic text-shadow shadow-md border-none"
				placeholder="Código de facultad">

			<input id="faculty-phone" name="phone" type="tel"
				class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-6 py-4 rounded-lg focus:outline-none text-indigo-500 placeholder:text-indigo-300 text-xl placeholder:italic text-shadow shadow-md border-none"
				placeholder="Teléfono de contacto">

			<select id="faculty-locality" name="localityID" required
				class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-6 py-4 rounded-lg focus:outline-none text-indigo-500 placeholder:text-indigo-300 text-xl placeholder:italic text-shadow shadow-md border-none">
				<option value="" disabled selected>Selecciona la localidad</option>
			</select>

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

    // ----------------------
    // lifecycle
    // ----------------------
    async init() {
        // utilidades
        this.toast = new Toast();
        await this.toast.init();

        // services (instancias)
        this.facultiesService = new FacultiesService();
        this.localitiesService = new LocalitiesService();

        // servicios opcionales (correlativos / faculty-localities). Si no existen en tu proyecto, no fallará.
        try { this.facultyCorrelativesService = new FacultyCorrelativesService(); } catch (e) { this.facultyCorrelativesService = null; }
        try { this.facultyLocalitiesService = new FacultyLocalitiesService(); } catch (e) { this.facultyLocalitiesService = null; }

        // Context menu (una instancia reutilizable)
        this.contextMenu = new ContextMenu();

        // inicializar vista
        await this._renderFaculties();

        // evento para agregar
        document.querySelector('#add-faculty-btn')?.addEventListener('click', async () => {
            await this._openFacultyModal(null);
        });
    }

    // ----------------------
    // helpers para compat con distintas implementaciones de services
    // ----------------------
    async _list(service) {
        if (!service) return [];
        if (typeof service.getAll === 'function') return await service.getAll();
        if (typeof service.list === 'function') return await service.list();
        if (typeof service.get === 'function') return await service.get();
        // fallback: tratar de llamar al método estático si existe
        try {
            if (typeof service === 'function' && typeof service.list === 'function') return await service.list();
        } catch (_) {}
        return [];
    }

    async _create(service, data) {
        if (!service) throw new Error('Service no disponible');
        if (typeof service.create === 'function') return await service.create(data);
        if (typeof service.post === 'function') return await service.post(data);
        throw new Error('Método create/post no encontrado en service');
    }

    async _update(service, data) {
        if (!service) throw new Error('Service no disponible');
        if (typeof service.update === 'function') return await service.update(data);
        if (typeof service.put === 'function') return await service.put(data);
        throw new Error('Método update/put no encontrado en service');
    }

    async _delete(service, id) {
        if (!service) throw new Error('Service no disponible');
        if (typeof service.delete === 'function') return await service.delete(id);
        if (typeof service.remove === 'function') return await service.remove(id);
        throw new Error('Método delete/remove no encontrado en service');
    }

    // ----------------------
    // render principal
    // ----------------------
    async _renderFaculties() {
        try {
            const [faculties, localities] = await Promise.all([
                this._list(this.facultiesService),
                this._list(this.localitiesService)
            ]);

            // mapa de localidades (rápido lookup)
            const localitiesMap = (Array.isArray(localities) ? localities : []).reduce((m, loc) => {
                const id = loc.localityID ?? loc.localityId ?? loc.id;
                if (id) m[id] = loc;
                return m;
            }, {});

            const container = document.querySelector('#faculty-list');
            container.innerHTML = '';

            (Array.isArray(faculties) ? faculties : []).forEach(fac => {
                const locality = localitiesMap[fac.localityID] || localitiesMap[fac.localityId] || {};

                const card = document.createElement('div');
                card.className = 'bg-gradient-to-tr from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] rounded-lg shadow p-6 w-80 flex flex-col justify-between faculty-card cursor-pointer';
                card.innerHTML = `
                    <h3 class="font-semibold text-indigo-700 mb-1">${fac.facultyName || fac.name || '—'}</h3>
                    <p class="text-sm text-indigo-500 mb-1">Código: ${fac.facultyCode ?? fac.code ?? '-'}</p>
                    <p class="text-sm text-indigo-500 mb-1">Teléfono: ${fac.contactPhone ?? fac.phone ?? '-'}</p>
                    <div class="mt-4 p-3 bg-indigo-100 rounded-md">
                        <h4 class="font-semibold text-indigo-600 mb-1">Localidad</h4>
                        <p class="text-sm text-indigo-600 mb-0.5">${locality.address ?? 'N/A'}</p>
                        <p class="text-sm text-indigo-600 mb-0.5">Teléfono: ${locality.phoneNumber ?? locality.phoneNumber ?? 'N/A'}</p>
                        ${locality.isMainLocality ? `<span class="inline-block mt-1 px-2 py-0.5 text-xs rounded bg-indigo-400 text-white font-semibold select-none">Sede principal</span>` : ''}
                    </div>
                    <div class="mt-3 flex items-center justify-between gap-2">
                        <button class="manage-correlatives-btn px-3 py-1 text-sm rounded bg-indigo-200">Correlativos</button>
                        <div class="text-xs text-[rgb(var(--text-from))]">ID: ${fac.facultyID ?? fac.facultyId ?? fac.id ?? '—'}</div>
                    </div>
                `;

                // contextmenu (click derecho) -> opciones Editar / Eliminar
                card.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    const facultyId = fac.facultyID ?? fac.facultyId ?? fac.id;
                    const actions = [
                        {
                            label: 'Editar',
                            onClick: () => this._openFacultyModal(fac)
                        },
                        {
                            label: 'Eliminar',
                            className: 'text-red-600',
                            onClick: async () => {
                                const confirmed = confirm('¿Eliminar esta facultad?');
                                if (!confirmed) return;
                                try {
                                    await this._delete(this.facultiesService, facultyId);
                                    this.toast.show('Facultad eliminada', 3000);
                                    await this._renderFaculties();
                                } catch (err) {
                                    console.error('[FacultiesInterface] Error eliminando facultad:', err);
                                    this.toast.show('Error al eliminar facultad');
                                }
                            }
                        }
                    ];

                    // abrir menú
                    this.contextMenu.open(e.clientX, e.clientY, actions);
                });

                // click en Correlativos (botón interno)
                const corrBtn = card.querySelector('.manage-correlatives-btn');
                corrBtn?.addEventListener('click', (ev) => {
                    ev.stopPropagation();
                    this._openCorrelativesModal(fac);
                });

                container.appendChild(card);
            });

        } catch (err) {
            console.error('[FacultiesInterface] Error al cargar facultades:', err);
            this.toast.show('Error al cargar facultades');
        }
    }

    // ----------------------
    // modal para crear / editar facultad
    // ----------------------
    async _openFacultyModal(fac = null) {
        const modal = new Modal({ templateId: 'tmpl-add-faculty', size: 'md' });
        await modal.open();

        const form = modal.contentHost.querySelector('#faculty-form');
        const cancelBtn = modal.contentHost.querySelector('#cancel-btn');
        const localitySelect = modal.contentHost.querySelector('#faculty-locality');

        // poblar select de localidades
        try {
            const localities = await this._list(this.localitiesService);
            localitySelect.innerHTML = `<option value="" disabled ${!fac ? 'selected' : ''}>Selecciona la localidad</option>`;
            (localities || []).forEach(loc => {
                const opt = document.createElement('option');
                opt.value = loc.localityID ?? loc.localityId ?? loc.id ?? '';
                opt.textContent = `${loc.address ?? '—'} ${loc.isMainLocality ? '(Sede principal)' : ''}`;
                localitySelect.appendChild(opt);
            });
        } catch (err) {
            console.warn('[FacultiesInterface] No se pudieron cargar localidades para el select', err);
        }

        // si es edición, rellenar campos
        if (fac) {
            form.querySelector('#faculty-name').value = fac.facultyName ?? fac.name ?? '';
            form.querySelector('#faculty-code').value = fac.facultyCode ?? fac.code ?? '';
            form.querySelector('#faculty-phone').value = fac.contactPhone ?? fac.phone ?? '';
            const idVal = fac.localityID ?? fac.localityId ?? fac.locality;
            if (idVal) {
                const optToSelect = localitySelect.querySelector(`option[value="${idVal}"]`);
                if (optToSelect) optToSelect.selected = true;
            }
            // guardar id para submit
            form.dataset.editingId = fac.facultyID ?? fac.facultyId ?? fac.id ?? '';
        } else {
            delete form.dataset.editingId;
        }

        // cancelar
        cancelBtn?.addEventListener('click', () => modal.close());

        // submit
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const payload = {
                facultyName: form.name.value.trim(),
                facultyCode: form.code.value.trim(),
                contactPhone: form.phone.value.trim(),
                localityID: form.localityID.value
            };

            if (!payload.facultyName || !payload.localityID) {
                this.toast.show('Por favor completa los campos obligatorios', 3000);
                return;
            }

            try {
                if (form.dataset.editingId) {
                    // actualizar (asegurar la propiedad esperada por el contract)
                    payload.facultyID = form.dataset.editingId;
                    await this._update(this.facultiesService, payload);
                    this.toast.show('Facultad actualizada', 3000);
                } else {
                    // crear
                    await this._create(this.facultiesService, payload);
                    this.toast.show('Facultad agregada', 3000);
                }
                modal.close();
                await this._renderFaculties();
            } catch (err) {
                console.error('[FacultiesInterface] Error guardando facultad:', err);
                this.toast.show('Error al guardar facultad');
            }
        });
    }

    // ----------------------
    // modal para correlativos (si existe service)
    // ----------------------
    async _openCorrelativesModal(fac) {
        if (!this.facultyCorrelativesService) {
            this.toast.show('Gestión de correlativos no disponible', 3000);
            return;
        }

        // construir contenido dinámico: listado + formulario para nuevo correlativo
        const content = document.createElement('div');
        content.innerHTML = `
            <div class="p-6 max-w-lg">
                <h3 class="text-xl font-semibold mb-4">Correlativos - ${fac.facultyName ?? fac.name}</h3>
                <div id="correlatives-list" class="mb-4"></div>

                <form id="correlative-form" class="flex gap-3 items-center">
                    <input name="correlativeNumber" type="number" min="1" placeholder="Número correlativo" class="flex-1 px-4 py-2 rounded-lg border" required />
                    <button type="submit" class="px-4 py-2 rounded bg-indigo-600 text-white">Agregar</button>
                </form>
            </div>
        `;

        const modal = new Modal({ content, renderMode: 'component', size: 'md' });
        // Modal constructor llama a _open en tu implementación; si no, usa modal.open()

        // renderizar correlativos actuales
        const refreshList = async () => {
            const all = await this._list(this.facultyCorrelativesService);
            const listHost = content.querySelector('#correlatives-list');
            listHost.innerHTML = '';
            const filtered = (all || []).filter(c => (c.facultyId ?? c.facultyID ?? c.facultyId) == (fac.facultyID ?? fac.facultyId ?? fac.id));
            if (!filtered.length) {
                listHost.innerHTML = `<p class="text-sm text-indigo-500">No hay correlativos</p>`;
                return;
            }
            filtered.forEach(item => {
                const div = document.createElement('div');
                div.className = 'flex items-center justify-between gap-3 p-2 bg-gray-50 rounded mb-2';
                div.innerHTML = `<div>#${item.correlativeNumber} ${item.facultyName ? `- ${item.facultyName}` : ''}</div>
                    <button class="delete-correlative text-sm text-red-500">Eliminar</button>`;
                const delBtn = div.querySelector('.delete-correlative');
                delBtn.addEventListener('click', async () => {
                    try {
                        const idToDelete = item.FacultyCorrelativeID ?? item.facultyCorrelativeID ?? item.id;
                        await this._delete(this.facultyCorrelativesService, idToDelete);
                        this.toast.show('Correlativo eliminado', 2500);
                        await refreshList();
                    } catch (err) {
                        console.error('Error eliminando correlativo', err);
                        this.toast.show('Error al eliminar correlativo');
                    }
                });
                listHost.appendChild(div);
            });
        };

        await refreshList();

        // submit nuevo correlativo
        const form = content.querySelector('#correlative-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const n = Number(form.correlativeNumber.value);
            if (!n || n < 1) {
                this.toast.show('Número inválido', 2500);
                return;
            }
            try {
                const payload = {
                    facultyId: fac.facultyID ?? fac.facultyId ?? fac.id,
                    correlativeNumber: n
                };
                await this._create(this.facultyCorrelativesService, payload);
                this.toast.show('Correlativo agregado', 2500);
                form.correlativeNumber.value = '';
                await refreshList();
            } catch (err) {
                console.error('Error creando correlativo', err);
                this.toast.show('Error al crear correlativo');
            }
        });
    }
}
