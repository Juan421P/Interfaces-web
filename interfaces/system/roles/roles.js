import { Interface } from './../../base/interface.js';

import { RolesService } from './../../../js/services/system-roles.service.js';
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
                    <h1 class="text-2xl font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow select-none">
                        Gestión de Roles
                    </h1>
                    <div class="block bg-transparent group rounded-xl">
                        <div id="add-role-btn-container"></div>
                    </div>
                </div>
                <section id="role-list" class="flex flex-wrap gap-6"></section>
            </main>
            <template id="tmpl-add-role">
                <div class="max-w-md p-10 mx-auto">
                    <h2 class="text-2xl font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow mb-6">
                        Nuevo rol
                    </h2>
                    <p class="text-indigo-400">
                        Aquí irá el formulario para agregar un rol (próximamente)
                    </p>
                </div>
            </template>
            <template id="tmpl-role-card">
                <div class="bg-gradient-to-tr from-[rgb(var(--card-from))] to-[rgb(var(--card-to))] rounded-lg shadow p-6 w-64">
                    <h3 class="mb-1 font-semibold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent"
                        id="document-name"></h3>
                    <p class="text-sm bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent"
                        id="document-description"></p>
                </div>
            </template>
        `;
    }

    async init() {
        this.toast = new Toast();
        await this.toast.init();
        await this._setupRolesManagement();
    }

    async _setupRolesManagement() {
        const addRoleBtn = new Button({
            host: '#add-role-btn-container',
            text: 'Agregar rol',
            buttonType: 1,
            onClick: async () => {
                const modal = new Modal({
                    templateId: 'tmpl-add-role',
                    size: 'sm'
                });
                await modal.open();
            }
        });

        await this._renderRoles();
    }

    async _renderRoles() {
        try {
            const roles = await RolesService.list();
            const list = document.querySelector('#role-list');
            list.innerHTML = '';

            roles.forEach(role => {
                const tpl = document.querySelector('#tmpl-role-card').content.cloneNode(true);
                tpl.querySelector('#document-name').textContent = role.roleName;
                tpl.querySelector('#document-description').textContent = this._formatRoleType(role.roleType);
                list.appendChild(tpl);
            });

        } catch (error) {
            console.error('[SystemRolesInterface] Failed to load roles:', error);
            this.toast.show('Error al cargar los roles');
        }
    }

    _formatRoleType(type) {
        switch (type) {
            case 'admin': return 'Administrador';
            case 'ar': return 'Registro Académico';
            case 'teacher': return 'Docente';
            case 'hr': return 'Recursos Humanos';
            case 'student': return 'Estudiante';
            default: return '—';
        }
    }

}