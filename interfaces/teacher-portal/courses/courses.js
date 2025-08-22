import { ROUTES } from './../../../js/lib/routes.js';
// import { CoursesService } from './../../../js/services/courses.js'; // for real data

const { Modal } = await import(ROUTES.components.modal.js);
const { Table } = await import(ROUTES.components.table.js);

const HEADERS = ['Materia', 'Grupo', 'Ciclo Académico', 'Estudiantes'];

const rawCourses = [
    {
        subject: 'Bases de Datos I',
        group: '01',
        cycle: 'Ciclo 02/2025',
        classroom: 'Aula 204',
        schedule: 'Lunes y Miércoles 10:00 - 11:40',
        students: ['Juan Portillo', 'María Pérez', 'Luis Rodríguez']
    },
    {
        subject: 'Programación II',
        group: '03',
        cycle: 'Ciclo 02/2025',
        classroom: 'Laboratorio 3',
        schedule: 'Martes y Jueves 14:00 - 15:40',
        students: ['Pedro López', 'Ana García']
    }
];

const table = new Table({
    host: '#courses-teacher-table',
    headers: HEADERS,
    rows: [],
    sortable: true,
    paginated: true,
    perPage: 8,
    tableClasses: 'min-w-full text-sm table-fixed',
    headerClasses: 'px-4 py-3 font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow text-md',
    rowClasses: 'text-indigo-700',
    columnClasses: ['', 'text-center', 'text-center', 'text-center'],
    fixedLayout: true
});

export async function init() {
    await table.render();
    await loadCourses();
}

async function loadCourses() {
    const rows = rawCourses.map(c => [
        c.subject,
        c.group,
        c.cycle,
        `<button class="px-3 py-1 rounded bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition view-students-btn"
                 data-subject="${c.subject}">
            Ver (${c.students.length})
        </button>`
    ]);

    table.setRows(rows);
    bindViewButtons();
}

function bindViewButtons() {
    document.querySelectorAll('.view-students-btn').forEach(btn =>
        btn.addEventListener('click', async () => {
            const course = rawCourses.find(c => c.subject === btn.dataset.subject);
            if (course) await openStudentsModal(course);
        })
    );
}

async function openStudentsModal(course) {
    const modal = new Modal({ templateId: 'tmpl-course-students', size: 'md' });
    await modal.open();

    document.querySelector('#modal-classroom').textContent = course.classroom;
    document.querySelector('#modal-schedule').textContent = course.schedule;
    document.querySelector('#modal-group').textContent = course.group;
    document.querySelector('#modal-cycle').textContent = course.cycle;

    const studentsTable = new Table({
        host: '#modal-students-table',
        headers: ['#', 'Nombre del Estudiante'],
        rows: course.students.map((s, i) => [i + 1, s]),
        tableClasses: 'min-w-full text-sm table-fixed',
        headerClasses: 'px-4 py-3 font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow text-md',
        rowClasses: 'text-indigo-700',
        columnClasses: ['text-center', ''],
        fixedLayout: true
    });

    await studentsTable.render();
}
