import { ROUTES } from './../../../js/helpers/routes.js';

let table, contextMenu, modal;
let scheduleData = [];

export async function init() {
    const TableMod = await import(ROUTES.components.table.js);
    table = new TableMod.Table({
        host: '#schedule-table',
        headers: ['Hora', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        rows: [],
        tableClasses: 'min-w-full text-sm table-fixed',
        headerClasses: 'px-4 py-3 font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent drop-shadow',
        rowClasses: 'divide-y divide-indigo-100 text-indigo-700',
        fixedLayout: true
    });

    const ContextMenuMod = await import(ROUTES.components.contextMenu.js);
    contextMenu = new ContextMenuMod.ContextMenu();

    const ModalMod = await import(ROUTES.components.modal.js);
    modal = new ModalMod.Modal({ templateId: 'tmpl-schedule-modal', size: 'sm' });

    renderStudentInfo();
    await loadSchedule();
    renderSchedule();
}

function renderStudentInfo() {
    document.querySelector('#schedule-student-id').textContent = 'JP25002';
    document.querySelector('#schedule-student-name').textContent = 'Juan Adolfo';
    document.querySelector('#schedule-student-lastname').textContent = 'Portillo Sánchez';
}

async function loadSchedule() {
    scheduleData = [
        { name: 'Bases de Datos I', teacher: 'Rafael Mejía', room: 'Aula RM32', day: 1, time: '06:00 - 07:50' },
        { name: 'Programación II', teacher: 'Carlos Ramírez', room: 'Aula EC12', day: 4, time: '08:00 - 09:50' }
        // ...more
    ];
}

function renderSchedule() {
    const hours = ['06:00 - 07:50', '08:00 - 09:50', '10:00 - 11:50'];
    const rows = hours.map(h => {
        const row = [h];
        for (let d = 1; d <= 6; d++) {
            const subject = scheduleData.find(s => s.time === h && s.day === d);
            row.push(subject
                ? `<span class="block -mx-4 -my-3 px-4 py-3 rounded bg-indigo-100 text-indigo-700 font-medium cursor-pointer hover:bg-indigo-200 transition"
                        data-name="${subject.name}"
                        data-teacher="${subject.teacher}"
                        data-room="${subject.room}"
                        data-time="${subject.time}">
                        ${subject.name}
                   </span>`
                : '');
        }
        return row;
    });

    table.setRows(rows);

    // Add click events after render
    setTimeout(() => {
        document.querySelectorAll('#schedule-table span[data-name]').forEach(cell => {
            cell.addEventListener('contextmenu', e => {
                e.preventDefault();
                contextMenu.open(e.pageX, e.pageY, [
                    {
                        label: 'Ver Detalle',
                        onClick: () => openModal(cell)
                    }
                ]);
            });
        });
    }, 100);
}

function openModal(cell) {
    document.querySelector('#modal-class-name').textContent = cell.dataset.name;
    document.querySelector('#modal-class-teacher').textContent = cell.dataset.teacher;
    document.querySelector('#modal-class-room').textContent = cell.dataset.room;
    document.querySelector('#modal-class-time').textContent = cell.dataset.time;
    modal.open();
}
