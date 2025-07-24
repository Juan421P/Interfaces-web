import { ROUTES } from './../../../js/helpers/routes.js';
const { Modal } = await import(ROUTES.components.modal.js);

const mockCareerEnrollments = [
    {
        studentName: 'Ana María López',
        studentCode: 'AL23001',
        careerName: 'Ingeniería en Sistemas',
        startDate: '2023-02-10',
        status: 'Activa',
        statusDate: '2025-07-15'
    },
    {
        studentName: 'Carlos Hernández',
        studentCode: 'CH21001',
        careerName: 'Licenciatura en Matemática',
        startDate: '2021-08-20',
        status: 'Finalizada',
        statusDate: '2024-12-11'
    }
];

export async function init() {
    populateFilters();
    document.querySelector('#search-career-enrollments-btn')
        .addEventListener('click', () => searchEnrollments());
}

function populateFilters() {
    const careers = [...new Set(mockCareerEnrollments.map(e => e.careerName))];
    const careerSelect = document.querySelector('#filter-career');
    careers.forEach(c => careerSelect.insertAdjacentHTML('beforeend', `<option value="${c}">${c}</option>`));
}

function searchEnrollments() {
    const career = document.querySelector('#filter-career').value;
    const status = document.querySelector('#filter-status').value;
    const studentSearch = document.querySelector('#filter-student').value.toLowerCase();

    const filtered = mockCareerEnrollments.filter(e => {
        return (!career || e.careerName === career)
            && (!status || e.status === status)
            && (!studentSearch || e.studentName.toLowerCase().includes(studentSearch) || e.studentCode.toLowerCase().includes(studentSearch));
    });

    renderEnrollments(filtered);
}

function renderEnrollments(enrollments) {
    const container = document.querySelector('#career-enrollments-container');
    container.innerHTML = '';

    if (!enrollments.length) {
        container.innerHTML = `<p class="text-indigo-400 text-sm">No se encontraron resultados.</p>`;
        return;
    }

    enrollments.forEach(en => {
        const tpl = document.querySelector('#tmpl-career-enrollment-card').content.cloneNode(true);

        tpl.querySelector('#student-name').textContent = en.studentName;
        tpl.querySelector('#career-info').textContent = `${en.careerName} • ${en.studentCode}`;
        tpl.querySelector('#status').textContent = en.status;
        tpl.querySelector('#start-date').textContent = en.startDate;
        tpl.querySelector('#status-date').textContent = en.statusDate;

        tpl.querySelector('#view-career-enrollment-btn').addEventListener('click', () => openDetail(en));
        container.appendChild(tpl);
    });
}

async function openDetail(en) {
    const tpl = document.querySelector('#tmpl-career-enrollment-detail').content.cloneNode(true);

    tpl.querySelector('#detail-student').textContent = en.studentName;
    tpl.querySelector('#detail-career-info').textContent = `${en.careerName} • ${en.studentCode}`;
    tpl.querySelector('#detail-status').textContent = en.status;
    tpl.querySelector('#detail-start-date').textContent = en.startDate;
    tpl.querySelector('#detail-status-date').textContent = en.statusDate;

    const wrapper = document.createElement('div');
    wrapper.appendChild(tpl);

    const modal = new Modal({ size: 'md', content: wrapper.innerHTML });
    await modal.open();
}
