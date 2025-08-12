import { ROUTES } from './../../../js/helpers/routes.js';

const HEADERS = ['ID', 'Nombre', 'Código', 'Carrera', 'Correo'];
let table, toast, rawStudents = [];

export async function init() {
    toast = new (await import(ROUTES.components.toast.js)).Toast();
    await toast.init();

    const TableMod = await import(ROUTES.components.table.js);
    table = new TableMod.Table({
        host: '#student-table',
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

    document.querySelector('#student-search')
        .addEventListener('input', e => table._renderBody(e.target.value.toLowerCase()));

    document.querySelector('#add-student-btn')
        .addEventListener('click', async () => {
            const { Modal } = await import(ROUTES.components.modal.js);
            const modal = new Modal({ templateId: 'tmpl-add-student', size: 'sm' });
            await modal.open();
        });

    await loadStudents();
}

async function loadStudents() {
    try {
        rawStudents = [
            {
                studentID: 1,
                firstName: 'Julio',
                lastName: 'Pérez',
                studentCode: 'JP25001',
                careerName: 'Ingeniería en Desarrollo de Software',
                email: 'julio.perez@ejemplo.com'
            },
            {
                studentID: 2,
                firstName: 'Gabriela',
                lastName: 'Córdova',
                studentCode: 'GC25001',
                careerName: 'Licenciatura en Diseño Gráfico',
                email: 'gabriela.cordova@ejemplo.com'
            }
        ];

        const rows = rawStudents.map(s => [
            s.studentID,
            `${s.firstName} ${s.lastName}`,
            s.studentCode,
            s.careerName ?? '—',
            s.email ?? '—'
        ]);
        table.setRows(rows);
    } catch (error) {
        toast.show('Error al cargar estudiantes', 4000);
        console.error(error);
    }
}