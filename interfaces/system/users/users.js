import { Interface } from './../../base/interface.js';
import { UsersService } from './../../../js/services/users.service.js';

import {
    Modal,
    Toast,
    Table,
    Button,
    ContextMenu,
    FormComponent, 

} from './../../../components/components.js';

export default class UsersInterfaces extends Interface {
    static getTemplate() {
        return `
            <main class="flex flex-col min-h-screen p-10 space-y-8 md:ml-80 pb-80 md:pb-56">
                <button id="btn-add-user" class="px-4 py-2 bg-blue-600 text-white rounded">Agregar Usuario</button>
                
                <div id="users-table" class="mt-4"></div>

                <!-- Template para modal de usuario -->
                <template id="tmpl-user-form">
                    <form id="user-form" class="space-y-4">
                        <div>
                            <label>Email:</label>
                            <input type="email" name="email" placeholder="correo@dominio.com" required />
                        </div>
                        <div>
                            <label>Contraseña:</label>
                            <input type="password" name="contrasena" placeholder="********" required />
                        </div>
                        <div>
                            <label>Imagen URL:</label>
                            <input type="text" name="imageUrlUser" placeholder="https://..." />
                        </div>
                        <div>
                            <label>Universidad ID:</label>
                            <input type="text" name="universityID" placeholder="ID Universidad" required />
                        </div>
                        <div>
                            <label>Persona ID:</label>
                            <input type="text" name="personId" placeholder="ID Persona" required />
                        </div>
                        <div>
                            <label>Rol ID:</label>
                            <input type="text" name="roleId" placeholder="ID Rol" required />
                        </div>
                        <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded">Guardar</button>
                    </form>
                </template>
            </main>
        `;
    }

    constructor(opts = {}) {
        super(opts);
        this.usersService = new UsersService();
        this.userContract = new UserContract();
        this.modal = new Modal();
        this.contextMenu = new ContextMenu();

        this.load();
    }

    async load() {
        await this.renderTable();
        this._bindEvents();
    }

    _bindEvents() {
        document.getElementById('btn-add-user').addEventListener('click', () => {
            this.openUserModal();
        });
    }

    async renderTable() {
        const users = await this.usersService.getAll();
        const tableDiv = document.getElementById('users-table');
        tableDiv.innerHTML = '';

        users.forEach(user => {
            const row = document.createElement('div');
            row.className = 'flex justify-between items-center p-2 border-b cursor-pointer';
            row.textContent = `${user.personName} ${user.personLastName} - ${user.email}`;

            row.addEventListener('contextmenu', e => {
                e.preventDefault();
                this.contextMenu.open(e.pageX, e.pageY, [
                    {
                        label: 'Actualizar',
                        onClick: () => this.openUserModal(user)
                    },
                    {
                        label: 'Eliminar',
                        className: 'text-red-600',
                        onClick: async () => {
                            await this.usersService.delete(user.id);
                            this.renderTable();
                        }
                    }
                ]);
            });

            tableDiv.appendChild(row);
        });
    }

    openUserModal(user = null) {
        const template = document.getElementById('tmpl-user-form');
        const formClone = template.content.cloneNode(true);
        const formElement = formClone.querySelector('form');

        // Prellenar datos si es actualización
        if (user) {
            formElement.email.value = user.email || '';
            formElement.contrasena.value = user.contrasena || '';
            formElement.imageUrlUser.value = user.imageUrlUser || '';
            formElement.universityID.value = user.universityID || '';
            formElement.personId.value = user.personId || '';
            formElement.roleId.value = user.roleId || '';
            formElement.dataset.userId = user.id;
        }

        formElement.addEventListener('submit', async e => {
            e.preventDefault();

            const formData = {
                email: formElement.email.value,
                contrasena: formElement.contrasena.value,
                imageUrlUser: formElement.imageUrlUser.value,
                universityID: formElement.universityID.value,
                personId: formElement.personId.value,
                roleId: formElement.roleId.value
            };

            try {
                if (user) {
                    formData.id = user.id;
                    this.userContract.parse(formData, 'update');
                    await this.usersService.update(formData);
                } else {
                    this.userContract.parse(formData, 'create');
                    await this.usersService.create(formData);
                }

                this.modal.close();
                this.renderTable();
            } catch (err) {
                alert(err.message);
            }
        });

        this.modal.show(formClone);
    }
} 
//