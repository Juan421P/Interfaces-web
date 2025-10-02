import { Interface } from "../../base/interface.js";
import { EmployeesService } from "../../../js/services/employees.service.js";
import { Modal } from "../../../components/components";
import { Toast } from "../../../components/components";

export default class EmployeesInterface extends Interface{

    static getTemplate(){
        return `
            <main class="flex flex-col min-h-screen p-10 space-y-8 md:ml-80 pb-80 md:pb-56">

                <div class="flex items-center justify-between">

                    <h1
                        class="text-2xl font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow select-none">
                        Gestión de Empleados
                    </h1>

                <div
                    class="block transition-shadow duration-300 bg-transparent group rounded-xl hover:bg-white hover:shadow-lg">

                        <button id="add-employee-btn" type="button" class="flex items-center gap-5 px-5 py-4 text-indigo-400 transition-colors duration-300 rounded-lg group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-blue-400">

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

            <div id="employee-table" class="mt-4"></div>

        </main>

        <template id="tmpl-add-employee">

            <div class="max-w-md p-10 mx-auto">

                <h2
                    class="text-2xl font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow mb-6">
                    Nuevo empleado
                </h2>

                <p class="text-indigo-400">
                    Formulario por implementar.
                </p>

            </div>

        </template>
        `
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
            const employees = await this.service.getAll();
            const container = document.getElementById('employee-table');
            if (!container) return;

            container.innerHTML = employees.map(emp => `
                <div class="bg-gradient-to-br from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] rounded-xl p-6 shadow-md flex flex-col justify-between">
                    <div>
                        <h2 class="text-lg font-bold text-indigo-700">${emp.personName} ${emp.personLastName}</h2>
                        <p class="text-sm text-indigo-500">${emp.EmployeeDetail}</p>
                    </div>
                    <div class="flex justify-end gap-3 mt-4">
                        <button class="edit-employee-btn p-3 bg-indigo-100 text-indigo-400 rounded-xl shadow-md" data-id="${emp.id}">Editar</button>
                        <button class="delete-employee-btn p-3 bg-red-100 text-red-400 rounded-xl shadow-md" data-id="${emp.id}">Eliminar</button>
                    </div>
                </div>
            `).join('');

            this._bindEmployeeButtons();
        } catch (err) {
            this.toast.show('Error al cargar empleados');
            console.error(err);
        }
    }

    _bindCreateButton() {
        const btn = document.getElementById('add-employee-btn');
        if (!btn) return;

        btn.addEventListener('click', async () => {
            const modal = new Modal({ templateId: 'tmpl-add-employee', size: 'sm' });
            await modal._open();

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
                    EmployeeDetail: document.getElementById('employee-department').value.trim()
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
                const employees = await this.service.getAll();
                const emp = employees.find(e => e.id == id);
                if (!emp) return;

                const modal = new Modal({ templateId: 'tmpl-add-employee', size: 'sm' });
                await modal._open();

                document.getElementById('employee-code').value = emp.employeeCode;
                document.getElementById('employee-name').value = emp.personName;
                document.getElementById('employee-lastname').value = emp.personLastName;
                document.getElementById('employee-department').value = emp.EmployeeDetail;

                document.getElementById('cancel-btn').addEventListener('click', () => modal.close());

                document.getElementById('employee-form').addEventListener('submit', async e => {
                    e.preventDefault();
                    const data = {
                        id: emp.id,
                        employeeCode: document.getElementById('employee-code').value.trim(),
                        personName: document.getElementById('employee-name').value.trim(),
                        personLastName: document.getElementById('employee-lastname').value.trim(),
                        EmployeeDetail: document.getElementById('employee-department').value.trim()
                    };

                    try {
                        await this.service.update(data);
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
                    await this.service.delete(id);
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

/*import { ROUTES } from './../../../js/lib/routes.js';

const HEADERS = ['ID', 'Nombre', 'Departamento', 'Rol', 'Correo'];
let table, toast, rawEmployees = [];

export async function init() {
    toast = new (await import(ROUTES.components.toast.js)).Toast();
    await toast.init();

    const TableMod = await import(ROUTES.components.table.js);
    table = new TableMod.Table({
        host: '#employee-table',
        headers: HEADERS,
        rows: [],
        searchable: true,
        sortable: true,
        paginated: true,
        perPage: 10,
        tableClasses: 'min-w-full text-sm table-fixed',
        headerClasses: 'px-4 py-3 font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow text-md',
        rowClasses: 'divide-y divide-indigo-100 text-indigo-700',
        columnClasses: ['text-right', '', '', '', ''],
        fixedLayout: true
    });
    await table.render();

    document.querySelector('#employee-search')
        .addEventListener('input', e => table._renderBody(e.target.value.toLowerCase()));

    document.querySelector('#add-employee-btn')
        .addEventListener('click', async () => {
            const { Modal } = await import(ROUTES.components.modal.js);
            const modal = new Modal({ templateId: 'tmpl-add-employee', size: 'sm' });
            await modal.open();
        });

    await loadEmployees();
}

async function loadEmployees() {
    try {
        rawEmployees = [
            {
                employeeID: 1,
                firstName: 'Carlos',
                lastName: 'Ramírez',
                departmentName: 'Informática',
                roleName: 'Profesor',
                contactEmail: 'carlos.ramirez@ejemplo.com'
            },
            {
                employeeID: 2,
                firstName: 'Ana',
                lastName: 'López',
                departmentName: 'Administración',
                roleName: 'Administrador',
                contactEmail: 'ana.lopez@ejemplo.com'
            }
        ];

        const rows = rawEmployees.map(e => [
            e.employeeID,
            `${e.firstName} ${e.lastName}`,
            e.departmentName ?? '—',
            e.roleName ?? '—',
            e.contactEmail ?? '—'
        ]);
        table.setRows(rows);
    } catch (error) {
        toast.show('Error al cargar empleados', 4000);
        console.error(error);
    }
}*/
