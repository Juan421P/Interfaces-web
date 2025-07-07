import { ROUTES } from './../../../js/helpers/routes.js';

const { Modal } = await import(ROUTES.components.modal.js);
const { Table } = await import(ROUTES.components.table.js);
const toast = new (await import(ROUTES.components.toast.js)).Toast();
await toast.init();

// Mock services (replace later)
const roles = [
    { roleID: 1, roleName: 'Administrador del Sistema', roleType: 'admin' },
    { roleID: 2, roleName: 'Coordinador Académico', roleType: 'academic' },
    { roleID: 3, roleName: 'Docente', roleType: 'teacher' },
    { roleID: 4, roleName: 'Secretaría', roleType: 'staff' }
];

const permissions = [
    { permissionID: 1, permissionName: 'Ver usuarios', categoryName: 'Usuarios' },
    { permissionID: 2, permissionName: 'Editar usuarios', categoryName: 'Usuarios' },
    { permissionID: 3, permissionName: 'Ver roles', categoryName: 'Roles' },
    { permissionID: 4, permissionName: 'Asignar permisos', categoryName: 'Roles' },
    { permissionID: 5, permissionName: 'Ver auditoría', categoryName: 'Auditoría' }
];

let roleTable, permissionTable;

export async function init() {
    // Roles table
    roleTable = new Table({
        host: '#role-table',
        headers: ['ID', 'Nombre del Rol', 'Tipo'],
        rows: roles.map(r => [r.roleID, r.roleName, formatRoleType(r.roleType)]),
        tableClasses: 'min-w-full text-sm table-fixed',
        headerClasses: 'px-4 py-3 font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent drop-shadow text-md',
        rowClasses: 'divide-y divide-indigo-100 text-indigo-700',
        columnClasses: ['text-right', '', ''],
        fixedLayout: true
    });
    await roleTable.render();

    // Permissions table
    permissionTable = new Table({
        host: '#permission-table',
        headers: ['ID', 'Permiso', 'Categoría'],
        rows: permissions.map(p => [p.permissionID, p.permissionName, p.categoryName]),
        tableClasses: 'min-w-full text-sm table-fixed',
        headerClasses: 'px-4 py-3 font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent drop-shadow text-md',
        rowClasses: 'divide-y divide-indigo-100 text-indigo-700',
        columnClasses: ['text-right', '', ''],
        fixedLayout: true
    });
    await permissionTable.render();

    // Tab switching
    document.querySelectorAll('.role-tab-btn').forEach(btn =>
        btn.addEventListener('click', () => {
            document.querySelectorAll('.role-tab-btn').forEach(b => b.classList.remove('bg-indigo-50'));
            btn.classList.add('bg-indigo-50');

            const tab = btn.dataset.tab;
            document.querySelector('#role-table').classList.toggle('hidden', tab !== 'roles');
            document.querySelector('#permission-table').classList.toggle('hidden', tab !== 'permissions');
        })
    );

    document.querySelector('#add-role-btn')
        .addEventListener('click', async () => {
            const modal = new Modal({ templateId: 'tmpl-add-role', size: 'sm' });
            await modal.open();
        });
}

function formatRoleType(type) {
    switch (type) {
        case 'admin': return 'Administrador';
        case 'academic': return 'Académico';
        case 'teacher': return 'Docente';
        case 'staff': return 'Personal';
        default: return '—';
    }
}
