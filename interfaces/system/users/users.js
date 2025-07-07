import { ROUTES } from './../../../js/helpers/routes.js';
import { UsersService } from './../../../js/services/users.js';

const { Modal } = await import(ROUTES.components.modal.js);

const HEADERS = ['ID', 'Nombre', 'Correo', 'Tipo', 'Detalle'];
const FILTERS = {
    all: () => true,
    students: u => u.type === 'student',
    teachers: u => u.type === 'teacher',
    staff: u => u.type === 'staff'
};

let table, toast;

export async function init() {
    toast = new (await import(ROUTES.components.toast.js)).Toast();
    await toast.init();

    const TableMod = await import(ROUTES.components.table.js);
    table = new TableMod.Table({
        host: '#user-table',
        headers: HEADERS,
        rows: [],
        searchable: true,
        sortable: true,
        paginated: true,
        perPage: 10,
        tableClasses: 'min-w-full text-sm table-fixed',
        headerClasses: 'px-4 py-3 font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent drop-shadow text-md',
        rowClasses: 'divide-y divide-indigo-100 text-indigo-700',
        columnClasses: ['text-right', '', '', '', ''],
        fixedLayout: true
    });
    await table.render();

    const searchInput = document.querySelector('#user-search');
    searchInput.addEventListener('input', e => {
        const value = e.target.value.trim().toLowerCase();
        table._renderBody(value);
    });

    await loadUsers();

    document.querySelectorAll('.user-filter-btn').forEach(btn =>
        btn.addEventListener('click', () => {
            document.querySelectorAll('.user-filter-btn')
                .forEach(b => b.classList.remove('bg-indigo-50'));
            btn.classList.add('bg-indigo-50');
            applyFilter(btn.dataset.type);
        })
    );

    document.querySelector('#user-search')
        .addEventListener('input', e => table._renderBody(e.target.value.toLowerCase()));

    document.querySelector('#add-user-btn')
        .addEventListener('click', async () => {
            const modal = new Modal({ templateId: 'tmpl-add-user', size: 'sm' });
            await modal.open();
        });
}

async function loadUsers() {
    try {
        const plain = await UsersService.listMockup();
        rawUsers = plain;

        const rows = plain.map(u => [
            u.userID,
            `${u.firstName} ${u.lastName}`,
            u.email,
            mapRole(u),
            extraDetail(u)
        ]);

        table.setRows(rows);
    } catch (err) {
        toast.show('Error al cargar usuarios', 4000);
        console.error(err);
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

let rawUsers = [];
UsersService.list().then(r => (rawUsers = r));
