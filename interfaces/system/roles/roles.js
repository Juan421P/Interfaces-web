import { Interface } from './../../base/interface.js';

import { systemRolesService } from './../../../js/services/system-roles.service.js';
import {
    Modal,
    Button,
    Toast
} from './../../../components/components.js';

export default class RolesInterface extends Interface {

    static getTemplate() {
        return `
<main class="flex flex-col min-h-screen p-10 space-y-8 md:ml-80 pb-80 md:pb-56">
    <div class="flex items-center justify-between">
        <h1
            class="text-2xl font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow select-none">
            Gestión de Roles
        </h1>
        <div class="block bg-transparent group rounded-xl">
            <div id="add-role-btn-container"></div>
        </div>
    </div>
    <section id="role-list" class="flex flex-wrap gap-6">
    </section>
</main>

<template id="tmpl-add-role">
    <form id="role-form" class="max-w-md p-10 mx-auto flex flex-col gap-6">
        <h2
            class="text-2xl font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow mb-6">
            Nuevo rol
        </h2>
        <input id="role-name" type="text" placeholder="Nombre del rol"
            class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-4 py-3 rounded-lg focus:outline-none text-indigo-500 placeholder:text-indigo-300 text-lg placeholder:italic shadow-md border-none"
            required />

        <div class="flex justify-end gap-3">
            <button type="button" id="cancel-btn"
                class="px-4 py-2 bg-gradient-to-tr from-indigo-100 to-blue-100 text-indigo-400 rounded-xl font-medium shadow-md transition-all hover:scale-105">
                Cancelar
            </button>
            <button type="submit"
                class="px-4 py-2 bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] text-white rounded-xl font-medium shadow-md transition-all hover:scale-105">
                Guardar
            </button>
        </div>
    </form>
</template>

<template id="tmpl-role-card">
    <div class="bg-gradient-to-tr from-[rgb(var(--card-from))] to-[rgb(var(--card-to))] rounded-lg shadow p-6 w-64 flex flex-col justify-between">
        <div>
            <h3 class="mb-1 font-semibold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent"
                id="role-name"></h3>
        </div>
        <div class="flex justify-end gap-2 mt-4">
            <button class="edit-btn text-indigo-500 hover:underline text-sm">Editar</button>
            <button class="delete-btn text-red-500 hover:underline text-sm">Eliminar</button>
        </div>
    </div>
</template>
        `;
    }

    async init() {
        this.toast = new Toast();
        await this.toast.init();

        this.rolesService = new systemRolesService();

        // botón "Agregar rol"
        new Button({
            host: '#add-role-btn-container',
            text: 'Agregar rol',
            buttonType: 1,
            onClick: () => this._openRoleModal('create')
        });

        await this._renderRoles();
    }

    async _renderRoles() {
        try {
            const roles = await this.rolesService.getAll();
            const list = document.querySelector('#role-list');
            list.innerHTML = '';

            roles.forEach(role => {
                const tpl = document.querySelector('#tmpl-role-card').content.cloneNode(true);
                tpl.querySelector('#role-name').textContent = role.roleName;

                // botón editar
                tpl.querySelector('.edit-btn').addEventListener('click', () => {
                    this._openRoleModal('update', role);
                });

                // botón eliminar
                tpl.querySelector('.delete-btn').addEventListener('click', async () => {
                    if (confirm('¿Seguro que deseas eliminar este rol?')) {
                        try {
                            await this.rolesService.delete(role.roleID);
                            this.toast.show('Rol eliminado correctamente', 3000);
                            this._renderRoles();
                        } catch (err) {
                            console.error('Error eliminando rol:', err);
                            this.toast.show('Error al eliminar rol');
                        }
                    }
                });

                list.appendChild(tpl);
            });

        } catch (error) {
            console.error('[RolesInterface] Error al cargar roles:', error);
            this.toast.show('Error al cargar los roles');
        }
    }

    async _openRoleModal(mode, role = null) {
        const modal = new Modal({
            templateId: 'tmpl-add-role',
            size: 'sm'
        });
        await modal.open();

        const form = modal.contentHost.querySelector('#role-form');
        const input = form.querySelector('#role-name');
        if (mode === 'update' && role) {
            input.value = role.roleName;
        }

        form.querySelector('#cancel-btn').addEventListener('click', () => modal.close());

        form.addEventListener('submit', async e => {
            e.preventDefault();
            const roleName = input.value.trim();
            if (!roleName) {
                this.toast.show('El nombre del rol es obligatorio');
                return;
            }

            try {
                if (mode === 'create') {
                    await this.rolesService.create({ roleName });
                    this.toast.show('Rol agregado correctamente ✅', 3000);
                } else if (mode === 'update' && role) {
                    await this.rolesService.update({ roleID: role.roleID, roleName });
                    this.toast.show('Rol actualizado correctamente ✨', 3000);
                }
                modal.close();
                await this._renderRoles();
            } catch (err) {
                console.error('Error guardando rol:', err);
                this.toast.show('Error al guardar el rol');
            }
        });
    }
}
