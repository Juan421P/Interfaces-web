import { ROUTES } from './../../../js/lib/routes.js';
const { Modal } = await import(ROUTES.components.modal.js);

// json que le pedí a mi amigo gpt porque qué pereza ey
const mockCycleEnrollments = [
    {
        studentName: 'Ana María López',
        studentCode: 'AL23001',
        cycleLabel: 'Ciclo I - 2025',
        year: 2025,
        status: 'Activo',
        registeredAt: '2025-07-01',
        completedAt: ''
    },
    {
        studentName: 'Carlos Hernández',
        studentCode: 'CH21001',
        cycleLabel: 'Ciclo II - 2024',
        year: 2024,
        status: 'Finalizado',
        registeredAt: '2024-02-15',
        completedAt: '2024-07-30'
    }
];

export async function init() {
    populateFilters();
    document.querySelector('#search-cycle-enrollments-btn')
        .addEventListener('click', () => searchEnrollments());
}

function populateFilters() {
    const cycles = [...new Set(mockCycleEnrollments.map(c => c.cycleLabel))];
    const years = [...new Set(mockCycleEnrollments.map(c => c.year))];

    const cycleSelect = document.querySelector('#filter-cycle');
    cycles.forEach(c => cycleSelect.insertAdjacentHTML('beforeend', `<option value="${c}">${c}</option>`));

    const yearSelect = document.querySelector('#filter-year');
    years.forEach(y => yearSelect.insertAdjacentHTML('beforeend', `<option value="${y}">${y}</option>`));
}

function searchEnrollments() {
    const cycle = document.querySelector('#filter-cycle').value;
    const year = document.querySelector('#filter-year').value;
    const status = document.querySelector('#filter-status').value;
    const studentSearch = document.querySelector('#filter-student').value.toLowerCase();

    const filtered = mockCycleEnrollments.filter(c => {
        return (!cycle || c.cycleLabel === cycle)
            && (!year || c.year == year)
            && (!status || c.status === status)
            && (!studentSearch || c.studentName.toLowerCase().includes(studentSearch) || c.studentCode.toLowerCase().includes(studentSearch));
    });

    renderEnrollments(filtered);
}

function renderEnrollments(enrollments) {
    const container = document.querySelector('#cycle-enrollments-container');
    container.innerHTML = '';

    if (!enrollments.length) {
        container.innerHTML = `<p class="text-indigo-400 text-sm">No se encontraron resultados.</p>`;
        return;
    }

    enrollments.forEach(en => {
        const tpl = document.querySelector('#tmpl-cycle-enrollment-card').content.cloneNode(true);

        tpl.querySelector('#student-name').textContent = en.studentName;
        tpl.querySelector('#cycle-info').textContent = `${en.cycleLabel} • ${en.studentCode}`;
        tpl.querySelector('#status').textContent = en.status;
        tpl.querySelector('#registered-at').textContent = en.registeredAt || '-';
        tpl.querySelector('#completed-at').textContent = en.completedAt || '-';

        tpl.querySelector('#view-cycle-enrollment-btn').addEventListener('click', () => openDetail(en));
        container.appendChild(tpl);
    });
}

async function openDetail(en) {
    const tpl = document.querySelector('#tmpl-cycle-enrollment-detail').content.cloneNode(true);

    tpl.querySelector('#detail-student').textContent = en.studentName;
    tpl.querySelector('#detail-cycle-info').textContent = `${en.cycleLabel} • ${en.studentCode}`;
    tpl.querySelector('#detail-status').textContent = en.status;
    tpl.querySelector('#detail-registered-at').textContent = en.registeredAt || '-';
    tpl.querySelector('#detail-completed-at').textContent = en.completedAt || '-';

    const wrapper = document.createElement('div');
    wrapper.appendChild(tpl);

    const modal = new Modal({ size: 'md', content: wrapper.innerHTML });
    await modal.open();
}
