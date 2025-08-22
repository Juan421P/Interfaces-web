import { ROUTES } from './../../../../js/lib/routes.js';

const HEADERS = ['Código', 'Nombre', 'UV', 'Grupo', 'Profesor'];
const CALENDAR_HEADERS = ['Hora', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
let table, calendar;

export async function init() {
    renderStudentInfo();

    const { Table } = await import(ROUTES.components.table.js);

    table = new Table({
        host: '#cycle-table',
        headers: HEADERS,
        rows: [],
        searchable: false,
        sortable: false,
        paginated: false,
        tableClasses: 'min-w-full text-sm table-fixed',
        headerClasses: 'px-4 py-3 font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow text-md',
        rowClasses: 'divide-y divide-indigo-100 text-indigo-700',
        columnClasses: ['', '', 'text-center', 'text-center', ''],
        fixedLayout: true
    });
    await table.render();

    calendar = new Table({
        host: '#cycle-calendar',
        headers: CALENDAR_HEADERS,
        rows: [],
        paginated: false,
        sortable: false,
        tableClasses: 'min-w-full text-sm table-fixed',
        headerClasses: 'px-4 py-3 font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow text-md',
        rowClasses: 'divide-y divide-indigo-100 text-indigo-700',
        fixedLayout: true
    });
    await calendar.render();

    await loadCycleData();
}

function renderStudentInfo() {
    document.querySelector('#cycle-student-id').textContent = '20240454';
    document.querySelector('#cycle-student-name').textContent = 'Julio Josué';
    document.querySelector('#cycle-student-lastname').textContent = 'Pérez Rodríguez';
    document.querySelector('#cycle-admin').textContent = 'Lic. Max Jiménez';
    document.querySelector('#cycle-student-code').textContent = 'LMI28316';
    document.querySelector('#cycle-student-career').textContent = 'Ingeniería en Desarrollo de Software';
    document.querySelector('#cycle-student-plan').textContent = '2004';
    document.querySelector('#cycle-student-modality').textContent = 'Presencial';
    document.querySelector('#cycle-student-state').textContent = 'Inscrito';
}

async function loadCycleData() {
    const courses = await mockCycleCourses();
    const rows = courses.map(c => [c.code, c.name, c.uv, c.group, c.teacher]);
    table.setRows(rows);

    const times = [...new Set(courses.flatMap(c => c.schedule.map(s => s.time)))].sort();
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    const calendarRows = times.map(time => {
        const row = [time];
        days.forEach(day => {
            const subject = courses.find(c =>
                c.schedule.some(s => s.day === day && s.time === time)
            );

            row.push(subject
                ? `<span class="block -mx-4 -my-3 px-4 py-3 rounded bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] text-white font-medium">
                 ${subject.name} (G${subject.group})
               </span>`
                : '');
        });
        return row;
    });
    calendar.setRows(calendarRows);

}

async function mockCycleCourses() {
    return [
        {
            code: 'PROG 502', name: 'Programación II', uv: 4, group: 1, teacher: 'Carlos Menjívar',
            schedule: [{ day: 'Lunes', time: '06:00-07:50' }, { day: 'Miércoles', time: '06:00-07:50' }]
        },
        {
            code: 'MATE 303', name: 'Matemática III', uv: 4, group: 3, teacher: 'Luis Hernández',
            schedule: [{ day: 'Martes', time: '08:00-09:50' }, { day: 'Jueves', time: '08:00-09:50' }]
        }
    ];
}
