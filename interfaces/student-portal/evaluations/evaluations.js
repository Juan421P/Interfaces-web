import { ROUTES } from './../../../js/lib/routes';

let evaluations = [];

export async function init() {
    evaluations = await loadMockEvaluations();

    renderStudentInfo();
    renderSubjects();
}

function renderStudentInfo() {
    document.querySelector('#eval-student-id').textContent = 'JP25001';
    document.querySelector('#eval-student-name').textContent = 'Julio Josué';
    document.querySelector('#eval-student-lastname').textContent = 'Pérez Rodríguez';
    document.querySelector('#eval-student-code').textContent = 'DSOF301';
    document.querySelector('#eval-student-career').textContent = 'Ingeniería en Desarrollo de Software';
    document.querySelector('#eval-student-plan').textContent = '2004';
    document.querySelector('#eval-student-modality').textContent = 'Presencial';
}

function renderSubjects() {
    const container = document.querySelector('#eval-subjects');
    container.innerHTML = '';

    const tmpl = document.querySelector('#tmpl-eval-subject');

    evaluations.forEach(e => {
        const clone = tmpl.content.cloneNode(true);
        clone.querySelector('#eval-subject-code').textContent = e.code;
        clone.querySelector('#eval-subject-name').textContent = e.name;
        clone.querySelector('#eval-subject-group').textContent = e.group;
        clone.querySelector('#eval-subject-date').textContent = e.date;
        clone.querySelector('#eval-subject-room').textContent = e.room;
        clone.querySelector('#eval-subject-time').textContent = e.time;
        container.appendChild(clone);
    });
}

async function loadMockEvaluations() {
    return [
        { code: 'BADA 501', name: 'Base de Datos I', group: '2', date: '2025-03-17', room: 'Aula RM 32. Edificio Dr. Rafael Menjivar', time: '06:00:00 a 07:50:00' },
        { code: 'INGL 101', name: 'Inglés I', group: '1', date: '2025-03-18', room: 'Aula EC 11. Edificio Compartido', time: '06:00:00 a 07:50:00' },
        { code: 'FISI 501', name: 'Física II', group: '3', date: '2025-03-19', room: 'Aula CR 25. Edificio Carlos Rodas', time: '08:00:00 a 09:50:00' },
        { code: 'MATE 303', name: 'Matemática III', group: '3', date: '2025-03-20', room: 'Aula EC 12. Edificio Compartido', time: '08:00:00 a 09:50:00' },
        { code: 'PROG 501', name: 'Programación I', group: '3', date: '2025-05-05', room: 'Aula RM 32. Edificio Dr. Rafael Menjivar', time: '06:00:00 a 07:50:00' },
        { code: 'PROG 502', name: 'Programación II', group: '1', date: '2025-05-06', room: 'Aula EC 11. Edificio Compartido', time: '06:00:00 a 07:50:00' }
    ];
}
