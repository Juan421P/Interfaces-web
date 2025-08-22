import { ROUTES } from './../../../js/lib/routes.js';
const { Modal } = await import(ROUTES.components.modal.js);

const allPerformances = [
    {
        studentName: 'Ana María López',
        studentCode: 'STU001',
        careerName: 'Ingeniería en Sistemas',
        cycleLabel: 'Ciclo II - 2025',
        year: 2025,
        totalValueUnits: 32,
        totalUnitMerit: 115,
        MeritUnitCoefficient: 3.59,
        computedAt: '2025-07-15 10:32 AM'
    },
    {
        studentName: 'Carlos Hernández',
        studentCode: 'STU002',
        careerName: 'Licenciatura en Matemática',
        cycleLabel: 'Ciclo II - 2025',
        year: 2025,
        totalValueUnits: 28,
        totalUnitMerit: 92,
        MeritUnitCoefficient: 3.28,
        computedAt: '2025-07-16 02:11 PM'
    }
];

export async function init() {
    populateFilters();

    document.querySelector('#search-performance-btn')
        .addEventListener('click', () => searchPerformances());
}

function populateFilters() {
    const careers = [...new Set(allPerformances.map(p => p.careerName))];
    const cycles = [...new Set(allPerformances.map(p => p.cycleLabel))];
    const years = [...new Set(allPerformances.map(p => p.year))];

    const careerSelect = document.querySelector('#filter-career');
    careers.forEach(c => {
        careerSelect.insertAdjacentHTML('beforeend', `<option value="${c}">${c}</option>`);
    });

    const cycleSelect = document.querySelector('#filter-cycle');
    cycles.forEach(c => {
        cycleSelect.insertAdjacentHTML('beforeend', `<option value="${c}">${c}</option>`);
    });

    const yearSelect = document.querySelector('#filter-year');
    years.forEach(y => {
        yearSelect.insertAdjacentHTML('beforeend', `<option value="${y}">${y}</option>`);
    });
}

function searchPerformances() {
    const career = document.querySelector('#filter-career').value;
    const cycle = document.querySelector('#filter-cycle').value;
    const year = document.querySelector('#filter-year').value;
    const studentSearch = document.querySelector('#filter-student').value.toLowerCase();

    const filtered = allPerformances.filter(p => {
        return (!career || p.careerName === career)
            && (!cycle || p.cycleLabel === cycle)
            && (!year || p.year == year)
            && (!studentSearch || p.studentName.toLowerCase().includes(studentSearch) || p.studentCode.toLowerCase().includes(studentSearch));
    });

    renderPerformances(filtered);
}

function renderPerformances(performances) {
    const container = document.querySelector('#performance-container');
    container.innerHTML = '';

    if (!performances.length) {
        container.innerHTML = `<p class="text-indigo-400 text-sm">No se encontraron resultados.</p>`;
        return;
    }

    performances.forEach(perf => {
        const tpl = document.querySelector('#tmpl-performance-card').content.cloneNode(true);

        tpl.querySelector('#student-name').textContent = perf.studentName;
        tpl.querySelector('#career-cycle').textContent = `${perf.careerName} • ${perf.cycleLabel}`;
        tpl.querySelector('#total-uv').textContent = perf.totalValueUnits;
        tpl.querySelector('#total-merit').textContent = perf.totalUnitMerit;
        tpl.querySelector('#muc').textContent = perf.MeritUnitCoefficient.toFixed(2);
        tpl.querySelector('#computed-at').textContent = `Calculado el ${perf.computedAt}`;

        tpl.querySelector('#view-performance-btn').addEventListener('click', () => openPerformanceDetail(perf));

        container.appendChild(tpl);
    });
}

async function openPerformanceDetail(perf) {
    const tpl = document.querySelector('#tmpl-performance-detail').content.cloneNode(true);

    tpl.querySelector('#detail-student').textContent = perf.studentName;
    tpl.querySelector('#detail-career-cycle').textContent = `${perf.careerName} • ${perf.cycleLabel}`;
    tpl.querySelector('#detail-total-uv').textContent = perf.totalValueUnits;
    tpl.querySelector('#detail-total-merit').textContent = perf.totalUnitMerit;
    tpl.querySelector('#detail-muc').textContent = perf.MeritUnitCoefficient.toFixed(2);
    tpl.querySelector('#detail-computed-at').textContent = perf.computedAt;

    const wrapper = document.createElement('div');
    wrapper.appendChild(tpl);

    const modal = new Modal({ size: 'md', content: wrapper.innerHTML });
    await modal.open();
}
