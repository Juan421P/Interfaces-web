let pensum = [];

export async function init() {
    await loadPensum();
    renderPensum();
}

async function loadPensum() {
    pensum = [
        {
            cycle: 'I',
            subjects: [
                { code: 'MAT101', name: 'Matemática I', uv: 4, status: 'Aprobada' },
                { code: 'PROG101', name: 'Programación I', uv: 4, status: 'En Curso' }
            ]
        },
        {
            cycle: 'II',
            subjects: [
                { code: 'DBD304', name: 'Bases de Datos I', uv: 4, status: 'Pendiente' }
            ]
        }
    ];
}

function renderPensum() {
    const container = document.querySelector('#pensum-container');
    const tmplCycle = document.querySelector('#tmpl-pensum-cycle');
    const tmplSubject = document.querySelector('#tmpl-pensum-subject');

    container.innerHTML = '';

    pensum.forEach(c => {
        const cycleEl = tmplCycle.content.cloneNode(true);
        cycleEl.querySelector('#cycle-name').textContent = c.cycle;

        const subjContainer = cycleEl.querySelector('#cycle-subjects');

        c.subjects.forEach(s => {
            const subjEl = tmplSubject.content.cloneNode(true);
            subjEl.querySelector('#subject-code').textContent = s.code;
            subjEl.querySelector('#subject-name').textContent = s.name;
            subjEl.querySelector('#subject-uv').textContent = s.uv;
            subjEl.querySelector('#subject-status').textContent = s.status;
            subjContainer.appendChild(subjEl);
        });

        container.appendChild(cycleEl);
    });
}
