// interfaces/system/users/users.js
import { Interface } from './../../base/interface.js';
import { UsersService } from './../../../js/services/users.service.js';

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
    this.usersService = new UsersService(); // ✅ solo Service como intermediario
    this.toast = new Toast();
    this.currentUser = null;
  }

  async init() {
    await this._setupToast();
    await this._setupAddButton();
    await this._setupTable();
  }

  async _setupToast() {
    await this.toast.init?.();
  }

  async _setupAddButton() {
    const container = document.getElementById('add-user-btn-container');
    if (!container) {
      console.warn('[UsersInterface] Add user button container not found');
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
      console.error('[UsersInterface] User table host not found');
      return;
    }

    this.table = new Table({
      host: '#user-table',
      service: this.usersService, // ✅ Table consumirá service.list()/getAll()
      headers: [
        { label: 'Nombre',   key: 'personName' },
        { label: 'Apellido', key: 'personLastName' },
        { label: 'Email',    key: 'email' },
        { label: 'Rol',      key: 'roleId' },
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
    if (!confirm('¿Está seguro de que desea eliminar este usuario?')) return;

    try {
      await UsersService.delete(userId); // ✅ estático como tu patrón de services
      this.toast?.show?.('Usuario eliminado correctamente ✅');
      await this.table.reload();
    } catch (error) {
      console.error('[UsersInterface] Error deleting user:', error);
      this.toast?.show?.('Error al eliminar el usuario 😔');
    }
  }

  openUserModal(user = null) {
    this.currentUser = user;

    const modal = new Modal({
      templateId: 'tmpl-user-modal',
      size: 'md',
      title: user ? 'Editar Usuario' : 'Nuevo Usuario'
    });

    // Modal ya montado -> render form
    this._setupUserForm(modal);
  }

  async _setupUserForm(modal) {
    const formHost = document.getElementById('user-form-host');
    if (!formHost) {
      console.error('[UsersInterface] User form host not found');
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
            },
            {
              type: FormInput,
              opts: {
                id: 'password-input',
                type: 'password',
                placeholder: 'Contraseña',
                value: ''
              },
            }
          ]
        },
        {
          opts: { layout: 'horizontal', gap: 4, classes: 'md:gap-4' },
          components: [
            {
              type: FormInput,
              opts: {
                id: 'person-name-input',
                type: 'text',
                placeholder: 'Nombre',
                value: this.currentUser?.personName || ''
              },
            },
            {
              type: FormInput,
              opts: {
                id: 'person-lastname-input',
                type: 'text',
                placeholder: 'Apellido',
                value: this.currentUser?.personLastName || ''
              },
            }
          ]
        },
        {
          opts: { layout: 'horizontal', gap: 4, classes: 'md:gap-4' },
          components: [
            {
              type: FormInput,
              opts: {
                id: 'role-input',
                type: 'text',
                placeholder: 'ID del Rol',
                value: this.currentUser?.roleId || ''
              },
            },
            {
              type: FormInput,
              opts: {
                id: 'university-input',
                type: 'text',
                placeholder: 'ID Universidad',
                value: this.currentUser?.universityID || ''
              },
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
          this.toast?.show?.('Por favor corrige los errores en el formulario');
          return;
        }

        // Construye el payload desde el form
        const formData = {
          email: values['email-input'],
          contrasena: values['password-input'],
          personName: values['person-name-input'],
          personLastName: values['person-lastname-input'],
          roleId: values['role-input'],
          universityID: values['university-input'],
          imageUrlUser: values['image-url-input'],
          // personId: si tu backend lo requiere para create, agrega un input de persona aquí.
          personId: this.currentUser?.personId || ''
        };

        if (this.currentUser) formData.id = this.currentUser.id;

        try {
          if (this.currentUser) {
            await UsersService.update(formData);  // ✅ contract.parse lo hace el Service
            this.toast?.show?.('Usuario actualizado correctamente ✅');
          } else {
            await UsersService.create(formData);  // ✅ contract.parse en Service
            this.toast?.show?.('Usuario creado correctamente ✅');
          }

          modal.close();
          await this.table.reload();

        } catch (error) {
          console.error('[UsersInterface] Error saving user:', error);
          this.toast?.show?.(error?.message || 'Error al guardar el usuario 😔');
        }
      }
    });
  }

  destroy() {
    this.table?.destroy?.();
    super.destroy();
  }
}
