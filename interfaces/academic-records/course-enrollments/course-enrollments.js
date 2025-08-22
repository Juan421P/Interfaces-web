import { ROUTES } from './../../../js/lib/routes.js';
const { Modal } = await import(ROUTES.components.modal.js);

const mockCourseEnrollments = [
    {
        studentName: 'Ana María López',
        studentCode: 'AL23001',
        courseName: 'Programación Avanzada',
        teacher: 'Ricardo De Paz',
        classroom: 'A-204',
        cycleLabel: 'Ciclo II - 2025',
        status: 'Activo',
        finalGrade: '',
        enrollmentDate: '2025-07-05'
    },
    {
        studentName: 'Carlos Hernández',
        studentCode: 'CH21001',
        courseName: 'Álgebra Superior',
        teacher: 'Balmore Reyes',
        classroom: 'B-101',
        cycleLabel: 'Ciclo I - 2025',
        status: 'Aprobado',
        finalGrade: 8.7,
        enrollmentDate: '2025-02-10'
    },
    {
        studentName: 'Christopher Padilla',
        studentCode: 'CP24001',
        courseName: 'Bases de Datos',
        teacher: 'Josué Guinea',
        classroom: 'C-303',
        cycleLabel: 'Ciclo I - 2024',
        status: 'Reprobado',
        finalGrade: 4.3,
        enrollmentDate: '2024-03-01'
    },
    {
        studentName: 'Elías Romero',
        studentCode: 'ER23001',
        courseName: 'Análisis Matemático',
        teacher: 'Daniel Alvarado',
        classroom: 'Lab-Math-01',
        cycleLabel: 'Ciclo II - 2024',
        status: 'Retirado',
        finalGrade: '',
        enrollmentDate: '2024-08-15'
    }
];

export async function init() {
    populateFilters();
    document.querySelector('#search-course-enrollments-btn')
        .addEventListener('click', () => searchEnrollments());
}

function populateFilters() {
    const courses = [...new Set(mockCourseEnrollments.map(c => c.courseName))];
    const cycles = [...new Set(mockCourseEnrollments.map(c => c.cycleLabel))];

    const courseSelect = document.querySelector('#filter-course');
    courses.forEach(c => courseSelect.insertAdjacentHTML('beforeend', `<option value="${c}">${c}</option>`));

    const cycleSelect = document.querySelector('#filter-cycle');
    cycles.forEach(c => cycleSelect.insertAdjacentHTML('beforeend', `<option value="${c}">${c}</option>`));
}

function searchEnrollments() {
    const course = document.querySelector('#filter-course').value;
    const cycle = document.querySelector('#filter-cycle').value;
    const status = document.querySelector('#filter-status').value;
    const studentSearch = document.querySelector('#filter-student').value.toLowerCase();

    const filtered = mockCourseEnrollments.filter(e => {
        return (!course || e.courseName === course)
            && (!cycle || e.cycleLabel === cycle)
            && (!status || e.status === status)
            && (!studentSearch || e.studentName.toLowerCase().includes(studentSearch) || e.studentCode.toLowerCase().includes(studentSearch));
    });

    renderEnrollments(filtered);
}

function renderEnrollments(enrollments) {
    const container = document.querySelector('#course-enrollments-container');
    container.innerHTML = '';

    if (!enrollments.length) {
        container.innerHTML = `<p class="text-indigo-400 text-sm">No se encontraron resultados.</p>`;
        return;
    }

    enrollments.forEach(en => {
        const tpl = document.querySelector('#tmpl-course-enrollment-card').content.cloneNode(true);

        tpl.querySelector('#student-name').textContent = en.studentName;
        tpl.querySelector('#course-cycle').textContent = `${en.courseName} • ${en.cycleLabel}`;
        tpl.querySelector('#course-name').textContent = en.courseName;
        tpl.querySelector('#teacher').textContent = en.teacher;
        tpl.querySelector('#classroom').textContent = en.classroom;
        tpl.querySelector('#status').textContent = en.status;
        tpl.querySelector('#final-grade').textContent = en.finalGrade || '-';

        tpl.querySelector('#view-course-enrollment-btn').addEventListener('click', () => openDetail(en));
        container.appendChild(tpl);
    });
}

async function openDetail(en) {
    const tpl = document.querySelector('#tmpl-course-enrollment-detail').content.cloneNode(true);

    tpl.querySelector('#detail-student').textContent = en.studentName;
    tpl.querySelector('#detail-course-cycle').textContent = `${en.courseName} • ${en.cycleLabel}`;
    tpl.querySelector('#detail-course-name').textContent = en.courseName;
    tpl.querySelector('#detail-teacher').textContent = en.teacher;
    tpl.querySelector('#detail-classroom').textContent = en.classroom;
    tpl.querySelector('#detail-status').textContent = en.status;
    tpl.querySelector('#detail-final-grade').textContent = en.finalGrade || '-';
    tpl.querySelector('#detail-enrollment-date').textContent = en.enrollmentDate;

    const wrapper = document.createElement('div');
    wrapper.appendChild(tpl);

    const modal = new Modal({ size: 'md', content: wrapper.innerHTML });
    await modal.open();
}