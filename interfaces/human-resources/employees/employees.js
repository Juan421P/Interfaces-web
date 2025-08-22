import { ROUTES } from './../../../js/lib/routes.js';

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
}
