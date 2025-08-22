import { ROUTES } from './../../../../js/lib/routes.js';

const HEADERS = ['Ciclo', 'Código', 'Nombre', 'UV', 'Grupo', 'Profesor'];
let table, rawCourses = [];
let currentCycle = 'all';

export async function init() {
    const TableMod = await import(ROUTES.components.table.js);
    table = new TableMod.Table({
        host: '#enroll-table',
        headers: HEADERS,
        rows: [],
        searchable: true,
        sortable: true,
        paginated: true,
        perPage: 10,
        tableClasses: 'min-w-full text-sm table-fixed',
        headerClasses: 'px-4 py-3 font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow text-md',
        rowClasses: 'divide-y divide-indigo-100 text-indigo-700',
        columnClasses: ['', '', '', '', '', ''],
        fixedLayout: true
    });
    await table.render();

    document.querySelector('#enroll-search')
        .addEventListener('input', e => table._renderBody(e.target.value.toLowerCase()));

    document.querySelectorAll('#enroll-filter-btn').forEach(btn =>
        btn.addEventListener('click', () => {
            document.querySelectorAll('.enroll-filter-btn').forEach(b => b.classList.remove('bg-indigo-50'));
            btn.classList.add('bg-indigo-50');
            currentCycle = btn.dataset.cycle;
            applyFilter();
        })
    );

    await loadCourses();
}

async function loadCourses() {
    rawCourses = await mockCourses();
    applyFilter();
}

function applyFilter() {
    const filtered = currentCycle === 'all' ? rawCourses : rawCourses.filter(c => c.cycle === currentCycle);
    const rows = filtered.map(c => [c.cycle, c.code, c.name, c.uv, c.group, c.teacher]);
    table.setRows(rows);
}

async function mockCourses() {
    return [
        { cycle: 'I-2025', code: 'PROG 502', name: 'Programación II', uv: 4, group: 'Teórico 1', teacher: 'Ing. Carlos Menjívar' },
        { cycle: 'I-2025', code: 'MATE 303', name: 'Matemática III', uv: 4, group: 'Teórico 3', teacher: 'Lic. Luis Hernández' },
        { cycle: 'II-2024', code: 'FISI 501', name: 'Física II', uv: 4, group: 'Teórico 3', teacher: 'Ing. Elena Ramírez' }
    ];
}
