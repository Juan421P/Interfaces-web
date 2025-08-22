import { ROUTES } from './../../../js/lib/routes.js';

let subjects = [];
let currentCycle = 'all';

export async function init() {
    subjects = await loadMockRecord();

    renderStudentInfo();
    renderSubjects();

    document.querySelectorAll('#record-cycle-btn').forEach(btn =>
        btn.addEventListener('click', () => {
            document.querySelectorAll('#record-cycle-btn')
                .forEach(b => b.classList.remove('bg-indigo-50'));
            btn.classList.add('bg-indigo-50');
            currentCycle = btn.dataset.cycle;
            renderSubjects();
        })
    );
}

function renderStudentInfo() {
    document.querySelector('#record-student-id').textContent = 'JP25002';
    document.querySelector('#record-student-name').textContent = 'Juan Adolfo';
    document.querySelector('#record-student-lastname').textContent = 'Portillo Sánchez';
    document.querySelector('#record-cum').textContent = '8.48';
    document.querySelector('#record-cycle').textContent = 'II - 2024';
    document.querySelector('#record-average').textContent = '8.5';
}

function renderSubjects() {
    const container = document.querySelector('#record-subjects');
    container.innerHTML = '';

    const filtered = currentCycle === 'all' ? subjects : subjects.filter(s => s.cycle === currentCycle);
    const tmpl = document.querySelector('#tmpl-record-subject');

    filtered.forEach(s => {
        const clone = tmpl.content.cloneNode(true);
        clone.querySelector('#record-subject-code').textContent = `${s.code}`;
        clone.querySelector('#record-subject-name').textContent = s.name;
        clone.querySelector('#record-subject-uv').textContent = s.uv;
        clone.querySelector('#record-subject-um').textContent = s.um;
        clone.querySelector('#record-subject-grade').textContent = s.grade;
        container.appendChild(clone);
    });
}

async function loadMockRecord() {
    return [
        { cycle: 'II-2024', code: 'MAT101', name: 'Matemática I', uv: 4, um: 30, grade: 7.0 },
        { cycle: 'II-2024', code: 'EST104', name: 'Estadística I', uv: 3, um: 24, grade: 8.0 },
        { cycle: 'II-2024', code: 'DBD304', name: 'Bases de Datos I', uv: 4, um: 36.4, grade: 9.1 },
        { cycle: 'II-2024', code: 'PROG302', name: 'Programación II', uv: 4, um: 38.4, grade: 9.2 }
    ];
}
