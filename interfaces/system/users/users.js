import { Interface } from './../../base/interface.js';
import { UsersService } from './../../../js/services/users.service.js';
import { UserContract } from './../../../js/contracts/user.contract.js';

import {
    Modal,
    Toast,
    Table,
    Button,
    ContextMenu,
    Form,
    FormInput,
    SubmitInput,
} from './../../../components/components.js';

export default class UsersInterface extends Interface {
    static getTemplate() {
        return `
            <main class="flex flex-col min-h-screen p-10 space-y-8 md:ml-80 pb-80 md:pb-56">
                <div class="flex items-center justify-between">
                    <h1 class="text-2xl font-bold bg-gradient-to-r from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] bg-clip-text text-transparent drop-shadow select-none">
                        Gestión de Usuarios
                    </h1>
                    <div class="block bg-transparent group rounded-xl">
                        <div id="add-user-btn-container"></div>
                    </div>
                </div>
                <div id="user-table" class="mt-4"></div>
            </main>

            <template id="tmpl-user-modal">
                <div id="user-form-host" class="p-6"></div>
            </template>
        `;
    }

    constructor(opts = {}) {
        super(opts);
        this.usersService = new UsersService();
        this.userContract = new UserContract();
        this.toast = new Toast();
        this.currentUser = null;
    }

    async init() {
        await this._setupToast();
        await this._setupAddButton();
        await this._setupTable();
    }

    async _setupToast() {
        this.toast = new Toast();
        await this.toast.init();
    }

    async _setupAddButton() {
        const container = document.getElementById('add-user-btn-container');
        if (!container) {
            console.warn('Add user button container not found');
            return;
        }

        this.addButton = new Button({
            host: '#add-user-btn-container',
            text: 'Agregar usuario',
            buttonType: 1,
            onClick: () => this.openUserModal()
        });
    }

    async _setupTable() {
        const tableHost = document.getElementById('user-table');
        if (!tableHost) {
            console.error('User table host not found');
            return;
        }

        this.table = new Table({
            host: '#user-table',
            service: this.usersService,
            headers: [
                { label: 'Nombre', key: 'personName' },
                { label: 'Apellido', key: 'personLastName' },
                { label: 'Email', key: 'email' },
                { label: 'Rol', key: 'roleId' },
                { label: 'Acciones', key: 'actions' }
            ],
            searchable: true,
            paginated: true,
            perPage: 10,
            searchFields: ['personName', 'personLastName', 'email', 'roleId'],
            sortable: true,
            useContextMenu: true,
            contextMenuOpts: (rowData) => this._getContextMenuItems(rowData)
        });

        await this.table.render();
    }

    _getContextMenuItems(user) {
        return [
            {
                label: 'Actualizar',
                onClick: () => this.openUserModal(user)
            },
            {
                label: 'Eliminar',
                className: 'text-red-600',
                onClick: async () => {
                    await this._deleteUser(user.id);
                }
            }
        ];
    }

    async _deleteUser(userId) {
        if (!confirm('¿Está seguro de que desea eliminar este usuario?')) {
            return;
        }

        try {
            await this.usersService.delete(userId);
            this.toast.show('Usuario eliminado correctamente ✅');
            await this.table.reload();
        } catch (error) {
            console.error('Error deleting user:', error);
            this.toast.show('Error al eliminar el usuario 😔');
        }
    }

    openUserModal(user = null) {
        this.currentUser = user;

        const modal = new Modal({
            templateId: 'tmpl-user-modal',
            size: 'md',
            title: user ? 'Editar Usuario' : 'Nuevo Usuario'
        });

        this._setupUserForm(modal);
    }

    async _setupUserForm(modal) {
        const formHost = document.getElementById('user-form-host');
        if (!formHost) {
            console.error('User form host not found');
            return;
        }

        this.userForm = new Form({
            host: '#user-form-host',
            formClass: 'gap-6',
            maxWidthClass: 'max-w-full',
            sections: [
                {
                    opts: { gap: 4 },
                    components: [
                        {
                            type: FormInput,
                            opts: {
                                id: 'email-input',
                                type: 'email',
                                placeholder: 'Correo electrónico',
                                value: this.currentUser?.email || ''
                            },
                            validation: ['email']
                        },
                        {
                            type: FormInput,
                            opts: {
                                id: 'password-input',
                                type: 'password',
                                placeholder: 'Contraseña',
                                value: ''
                            },
                            validation: ['password']
                        }
                    ]
                },
                {
                    opts: {
                        layout: 'horizontal',
                        gap: 4,
                        classes: 'md:gap-4'
                    },
                    components: [
                        {
                            type: FormInput,
                            opts: {
                                id: 'person-name-input',
                                type: 'text',
                                placeholder: 'Nombre',
                                value: this.currentUser?.personName || ''
                            },
                            validation: ['simpleText']
                        },
                        {
                            type: FormInput,
                            opts: {
                                id: 'person-lastname-input',
                                type: 'text',
                                placeholder: 'Apellido',
                                value: this.currentUser?.personLastName || ''
                            },
                            validation: ['simpleText']
                        }
                    ]
                },
                {
                    opts: {
                        layout: 'horizontal',
                        gap: 4,
                        classes: 'md:gap-4'
                    },
                    components: [
                        {
                            type: FormInput,
                            opts: {
                                id: 'role-input',
                                type: 'text',
                                placeholder: 'ID del Rol',
                                value: this.currentUser?.roleId || ''
                            },
                            validation: ['simpleText']
                        },
                        {
                            type: FormInput,
                            opts: {
                                id: 'university-input',
                                type: 'text',
                                placeholder: 'ID Universidad',
                                value: this.currentUser?.universityID || ''
                            },
                            validation: ['simpleText']
                        }
                    ]
                },
                {
                    opts: { gap: 4 },
                    components: [
                        {
                            type: FormInput,
                            opts: {
                                id: 'image-url-input',
                                type: 'text',
                                placeholder: 'URL de imagen',
                                value: this.currentUser?.imageUrlUser || ''
                            }
                        }
                    ]
                },
                {
                    opts: { gap: 4, classes: 'pt-4' },
                    components: [
                        {
                            type: SubmitInput,
                            opts: {
                                id: 'submit-user-button',
                                text: this.currentUser ? 'Actualizar Usuario' : 'Crear Usuario'
                            }
                        }
                    ]
                }
            ],
            onSubmit: async (values, errors) => {
                if (errors) {
                    this.toast.show('Por favor corrige los errores en el formulario');
                    return;
                }

                try {
                    const formData = {
                        email: values['email-input'],
                        contrasena: values['password-input'],
                        personName: values['person-name-input'],
                        personLastName: values['person-lastname-input'],
                        roleId: values['role-input'],
                        universityID: values['university-input'],
                        imageUrlUser: values['image-url-input'],
                        personId: this.currentUser?.personId || ''
                    };

                    if (this.currentUser) {
                        formData.id = this.currentUser.id;
                    }

                    const action = this.currentUser ? 'update' : 'create';
                    this.userContract.parse(formData, action);

                    if (this.currentUser) {
                        await this.usersService.update(formData);
                        this.toast.show('Usuario actualizado correctamente ✅');
                    } else {
                        await this.usersService.create(formData);
                        this.toast.show('Usuario creado correctamente ✅');
                    }

                    modal.close();
                    await this.table.reload();

                } catch (error) {
                    console.error('Error saving user:', error);
                    this.toast.show(error.message || 'Error al guardar el usuario 😔');
                }
            }
        });
    }

    destroy() {
        if (this.table) {
            this.table.destroy();
        }
        super.destroy();
    }
}