// interfaces/employees/employees.interface.js
import { Interface } from "../../base/interface.js";
import { EmployeesService } from "../../../js/services/employees.service.js";
import { Modal, Toast } from "../../../components/components.js";

export default class EmployeesInterface extends Interface {

  static getTemplate() {
    return `
<main class="flex flex-col min-h-screen p-10 space-y-8 md:ml-80 pb-80 md:pb-56">
  <div class="flex items-center justify-between">
    <h1
      class="text-2xl font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow select-none">
      Gestión de Empleados
    </h1>
    <div class="block transition-shadow duration-300 bg-transparent group rounded-xl hover:bg-white hover:shadow-lg">
      <button id="add-employee-btn" type="button"
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
          Agregar empleado
        </span>
      </button>
    </div>
  </div>

  <div class="sm:max-w-xs">
    <input id="employee-search" type="text" placeholder="Buscar"
      class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-4 py-3 rounded-lg focus:outline-none text-indigo-500 placeholder:text-indigo-300 placeholder:italic text-shadow shadow-md border-none select-none focus:ring-0" />
  </div>

  <div id="employee-table" class="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"></div>
</main>

<template id="tmpl-add-employee">
  <form id="employee-form" class="max-w-md p-6 mx-auto space-y-4">
    <h2
      class="text-2xl font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow mb-2">
      Nuevo empleado
    </h2>

    <input id="employee-code" type="text" placeholder="Código"
      class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-4 py-3 rounded-lg text-indigo-500 placeholder:text-indigo-300 shadow-md border-none" required>

    <input id="employee-name" type="text" placeholder="Nombre"
      class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-4 py-3 rounded-lg text-indigo-500 placeholder:text-indigo-300 shadow-md border-none" required>

    <input id="employee-lastname" type="text" placeholder="Apellido"
      class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-4 py-3 rounded-lg text-indigo-500 placeholder:text-indigo-300 shadow-md border-none" required>

    <input id="employee-department" type="text" placeholder="Detalle (departamento, etc.)"
      class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-4 py-3 rounded-lg text-indigo-500 placeholder:text-indigo-300 shadow-md border-none" required>

    <!-- Si tu API requiere personID / departmentID reales, cámbialos por selects -->
    <input id="employee-person-id" type="text" placeholder="Person ID"
      class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-4 py-3 rounded-lg text-indigo-500 placeholder:text-indigo-300 shadow-md border-none" required>

    <input id="employee-department-id" type="text" placeholder="Department ID"
      class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-4 py-3 rounded-lg text-indigo-500 placeholder:text-indigo-300 shadow-md border-none" required>

    <div class="flex justify-end gap-3 pt-2">
      <button type="button" id="cancel-btn"
        class="p-3 bg-gradient-to-tr from-indigo-100 to-blue-100 text-indigo-400 rounded-xl shadow-md">
        Cancelar
      </button>
      <button type="submit"
        class="p-3 bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] text-white drop-shadow rounded-xl">
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
    this.service = new EmployeesService();

    await this._loadData();
    this._bindCreateButton();
  }

  async _loadData() {
    try {
      const employees = await this.service.list(); // wrapper → GET real
      const container = document.getElementById('employee-table');
      if (!container) return;

      container.innerHTML = (employees || []).map(emp => `
        <div class="bg-gradient-to-br from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] rounded-xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <h2 class="text-lg font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent">
              ${emp.personName ?? ''} ${emp.personLastName ?? ''}
            </h2>
            <p class="text-sm text-indigo-500">${emp.EmployeeDetail ?? ''}</p>
            <p class="text-xs text-indigo-400 mt-1">Código: ${emp.employeeCode ?? '-'}</p>
          </div>
          <div class="flex justify-end gap-3 mt-4">
            <button class="edit-employee-btn p-3 bg-indigo-100 text-indigo-400 rounded-xl shadow-md" data-id="${emp.id}">Editar</button>
            <button class="delete-employee-btn p-3 bg-red-100 text-red-400 rounded-xl shadow-md" data-id="${emp.id}">Eliminar</button>
          </div>
        </div>
      `).join('');

      this._bindEmployeeButtons();
    } catch (err) {
      console.error(err);
      this.toast.show('Error al cargar empleados');
    }
  }

  _bindCreateButton() {
    const btn = document.getElementById('add-employee-btn');
    if (!btn) return;

    btn.addEventListener('click', async () => {
      const modal = new Modal({ templateId: 'tmpl-add-employee', size: 'sm' });
      await modal.open(); // ← open(), no _open()

      const form = document.getElementById('employee-form');
      const cancelBtn = document.getElementById('cancel-btn');
      if (!form || !cancelBtn) return;

      cancelBtn.addEventListener('click', () => modal.close());

      form.addEventListener('submit', async e => {
        e.preventDefault();
        const data = {
          employeeCode: document.getElementById('employee-code').value.trim(),
          personName: document.getElementById('employee-name').value.trim(),
          personLastName: document.getElementById('employee-lastname').value.trim(),
          EmployeeDetail: document.getElementById('employee-department').value.trim(),
          personID: document.getElementById('employee-person-id').value.trim(),
          departmentID: document.getElementById('employee-department-id').value.trim(),
        };

        try {
          await this.service.create(data);
          this.toast.show('Empleado creado correctamente');
          modal.close();
          await this._loadData();
        } catch (err) {
          console.error(err);
          this.toast.show('Error al crear empleado');
        }
      });
    });
  }

  _bindEmployeeButtons() {
    document.querySelectorAll('.edit-employee-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const employees = await this.service.list();
        const emp = (employees || []).find(e => String(e.id) === String(id));
        if (!emp) return;

        const modal = new Modal({ templateId: 'tmpl-add-employee', size: 'sm' });
        await modal.open();

        document.getElementById('employee-code').value = emp.employeeCode ?? '';
        document.getElementById('employee-name').value = emp.personName ?? '';
        document.getElementById('employee-lastname').value = emp.personLastName ?? '';
        document.getElementById('employee-department').value = emp.EmployeeDetail ?? '';
        document.getElementById('employee-person-id').value = emp.personID ?? '';
        document.getElementById('employee-department-id').value = emp.departmentID ?? '';

        document.getElementById('cancel-btn').addEventListener('click', () => modal.close());

        document.getElementById('employee-form').addEventListener('submit', async e => {
          e.preventDefault();
          const data = {
            employeeCode: document.getElementById('employee-code').value.trim(),
            personName: document.getElementById('employee-name').value.trim(),
            personLastName: document.getElementById('employee-lastname').value.trim(),
            EmployeeDetail: document.getElementById('employee-department').value.trim(),
            personID: document.getElementById('employee-person-id').value.trim(),
            departmentID: document.getElementById('employee-department-id').value.trim(),
          };

          try {
            await this.service.update(emp.id, data); // ← pasamos id por separado
            this.toast.show('Empleado actualizado correctamente');
            modal.close();
            await this._loadData();
          } catch (err) {
            console.error(err);
            this.toast.show('Error al actualizar empleado');
          }
        });
      });
    });

    document.querySelectorAll('.delete-employee-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        try {
          await this.service.delete(id); // wrapper → DELETE real
          this.toast.show('Empleado eliminado correctamente');
          await this._loadData();
        } catch (err) {
          console.error(err);
          this.toast.show('Error al eliminar empleado');
        }
      });
    });
  }
}