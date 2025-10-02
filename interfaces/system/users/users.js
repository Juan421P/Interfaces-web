// interfaces/system/users/users.js
import { Interface } from './../../base/interface.js';
import { UsersService } from './../../../js/services/users.service.js';

import {
  Modal,
  Toast,
  ContextMenu,
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

            <div class="flex justify-end gap-2 pt-2">
              <button type="button" id="btn-cancel" class="px-4 py-2 bg-neutral-300 rounded">Cancelar</button>
              <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded">Guardar</button>
            </div>
          </form>
        </template>
      </main>
    `;
  }

  constructor(opts = {}) {
    super(opts);
    this.usersService = new UsersService(); // ✅ solo Service
    this.modal = new Modal();
    this.contextMenu = new ContextMenu();
    this.toast = new Toast();
  }

  async init() {
    await this.toast.init?.();
    await this.load();
  }

  async load() {
    await this.renderTable();
    this._bindEvents();
  }

  _bindEvents() {
    const addBtn = document.getElementById('btn-add-user');
    if (addBtn) addBtn.addEventListener('click', () => this.openUserModal());
  }

  async renderTable() {
    const tableDiv = document.getElementById('users-table');
    if (!tableDiv) return;

    tableDiv.innerHTML = 'Cargando...';

    try {
      const users = await this.usersService.getAll();
      tableDiv.innerHTML = '';

      if (!users || users.length === 0) {
        tableDiv.innerHTML = `<div class="text-sm text-neutral-500">No hay usuarios registrados.</div>`;
        return;
      }

      users.forEach(user => {
        const row = document.createElement('div');
        row.className = 'flex justify-between items-center p-2 border-b cursor-pointer';
        row.textContent = `${user.personName || ''} ${user.personLastName || ''} - ${user.email || ''}`.trim();

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
                try {
                  await this.usersService.delete(user.id);
                  this.toast?.show?.('Usuario eliminado');
                  this.renderTable();
                } catch (err) {
                  this.toast?.show?.('No se pudo eliminar el usuario');
                  console.error(err);
                }
              }
            }
          ]);
        });

        tableDiv.appendChild(row);
      });

    } catch (err) {
      tableDiv.innerHTML = `<div class="text-sm text-red-600">Error al cargar usuarios</div>`;
      console.error('[UsersInterfaces] renderTable error:', err);
    }
  }

  openUserModal(user = null) {
    const template = document.getElementById('tmpl-user-form');
    if (!template) return;

    const fragment = template.content.cloneNode(true);
    const formElement = fragment.querySelector('#user-form');

    if (user) {
      formElement.email.value = user.email || '';
      formElement.contrasena.value = ''; // por seguridad
      formElement.imageUrlUser.value = user.imageUrlUser || '';
      formElement.universityID.value = user.universityID || '';
      formElement.personId.value = user.personId || '';
      formElement.roleId.value = user.roleId || '';
      formElement.dataset.userId = user.id;
    }

    formElement.querySelector('#btn-cancel')?.addEventListener('click', () => this.modal.close());

    formElement.addEventListener('submit', async e => {
      e.preventDefault();

      const formData = {
        email: formElement.email.value.trim(),
        contrasena: formElement.contrasena.value,
        imageUrlUser: formElement.imageUrlUser.value.trim(),
        universityID: formElement.universityID.value.trim(),
        personId: formElement.personId.value.trim(),
        roleId: formElement.roleId.value.trim()
      };

      try {
        if (user) {
          formData.id = user.id;
          await this.usersService.update(formData); // ✅ valida y parsea dentro del Service
          this.toast?.show?.('Usuario actualizado');
        } else {
          await this.usersService.create(formData); // ✅ valida y parsea dentro del Service
          this.toast?.show?.('Usuario creado');
        }

        this.modal.close();
        await this.renderTable();
      } catch (err) {
        console.error(err);
        alert(err?.message || 'Error en el formulario');
      }
    });

    this.modal.show(fragment);
  }
}
