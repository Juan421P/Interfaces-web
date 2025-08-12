import { ROUTES } from './../../../js/helpers/routes.js';
import { UsersService } from './../../../js/services/users.js';

const { Modal } = await import(ROUTES.components.modal.js);
const { Toast } = await import(ROUTES.components.toast.js);
const { Table } = await import(ROUTES.components.table.js);
const { Button } = await import(ROUTES.components.button.js);

const HEADERS = ['ID', 'Nombre', 'Correo', 'Tipo', 'Detalle'];
const FILTERS = {
    all: () => true,
    students: u => u.type === 'Estudiante',
    teachers: u => u.type === 'Docente',
    staff: u => u.type === 'Personal'
};

const toast = new Toast();
await toast.init();


const table = new Table({
    host: '#user-table',
    headers: HEADERS,
    rows: [],
    searchable: true,
    sortable: false,
    paginated: true,
    perPage: 10,
    tableClasses: 'min-w-full text-sm table-fixed',
    headerClasses: 'px-4 py-3 font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow text-md',
    rowClasses: 'divide-y divide-indigo-100 text-red-700',
    columnClasses: ['text-right', '', '', '', ''],
    fixedLayout: true
});
await table.render();

export async function init() {

    const searchInput = document.querySelector('#user-search');
    searchInput.addEventListener('input', e => {
        const value = e.target.value.trim().toLowerCase();
        table._renderBody(value);
    });

    await loadUsers();

    document.querySelectorAll('.user-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.user-filter-btn').forEach(b => b.classList.remove('bg-indigo-50'));
            btn.classList.add('bg-indigo-50');
            applyFilter(btn.dataset.type);
        })
    });

    document.querySelector('#user-search').addEventListener('input', e => table._renderBody(e.target.value.toLowerCase()));

    const addUserBtn = new Button({
        host: '#add-user-btn-container',
        text: 'Agregar usuario',
        collapseText: true,
        onClick: async () => {
            const modal = new Modal({ templateId: 'tmpl-add-user', size: 'sm' });
            await modal.open();
        }
    });
}

async function loadUsers() {
    try {

        const rows = (await UsersService.listMockup()).map(u => [
            u.userID,
            `${u.firstName} ${u.lastName}`,
            u.email,
            mapRole(u),
            extraDetail(u)
        ]);

        table.setRows(rows);
    } catch (error) {
        toast.show('Error al cargar usuarios');
        console.error(error);
    }
}


function mapRole(u) {
    if (u.studentID) return 'Estudiante';
    if (u.role === 'Teacher') return 'Profesor';
    return 'Personal';
}

function extraDetail(u) {
    if (u.studentID) return u.careerName ?? '—';
    if (u.role === 'Teacher') return u.departmentName ?? '—';
    return u.role ?? '—';
}

function applyFilter(key) {
    const fn = FILTERS[key] ?? FILTERS.all;
    const all = table.rows;
    const keep = all.filter((r, i) => fn(rawUsers[i]));
    table.setRows(keep);
}