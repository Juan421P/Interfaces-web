import { ROUTES } from './../../../js/lib/routes.js';
import { PensumsService } from './../../../js/services/pensums.js';

let allPensums = [];
let selectedPensum = null;

export async function init() {
    const selectionContainer = document.querySelector('#pensum-selection');
    const viewContainer = document.querySelector('#pensum-view');
    const title = document.querySelector('#selected-pensum-title');
    const pensumContainer = document.querySelector('#pensum-container');
    const backBtn = document.querySelector('#back-to-selection');

    allPensums = await PensumsService.list();
    populateFilters(allPensums);

    document.querySelector('#search-pensums-btn').addEventListener('click', () => {
        const career = document.querySelector('#filter-career').value;
        const year = document.querySelector('#filter-year').value;
        const subjectSearch = document.querySelector('#filter-subject').value.toLowerCase();

        const filtered = allPensums.filter(p => {
            const matchesCareer = !career || p.careerName === career;
            const matchesYear = !year || p.year.toString() === year;
            const matchesSubject = !subjectSearch || p.cycles.some(c =>
                c.subjects.some(s =>
                    s.code.toLowerCase().includes(subjectSearch) || s.name.toLowerCase().includes(subjectSearch)
                )
            );
            return matchesCareer && matchesYear && matchesSubject;
        });

        renderSelection(filtered);
    });

    backBtn.addEventListener('click', () => {
        selectedPensum = null;
        viewContainer.classList.add('hidden');
        selectionContainer.classList.remove('hidden');
        renderSelection(allPensums);
    });

    renderSelection(allPensums);
}

function populateFilters(pensums) {
    const careers = [...new Set(pensums.map(p => p.careerName))];
    const years = [...new Set(pensums.map(p => p.year))];

    const careerSelect = document.querySelector('#filter-career');
    careers.forEach(c => careerSelect.insertAdjacentHTML('beforeend', `<option value="${c}">${c}</option>`));

    const yearSelect = document.querySelector('#filter-year');
    years.forEach(y => yearSelect.insertAdjacentHTML('beforeend', `<option value="${y}">${y}</option>`));
}

function renderSelection(pensums) {
    const container = document.querySelector('#pensum-selection');
    const viewContainer = document.querySelector('#pensum-view');
    container.innerHTML = '';
    viewContainer.classList.add('hidden');

    if (!pensums.length) {
        container.innerHTML = `<p class="text-indigo-400 text-sm">No se encontraron resultados.</p>`;
        return;
    }

    pensums.forEach(p => {
        const tpl = document.querySelector('#tmpl-pensum-card').content.cloneNode(true);
        tpl.querySelector('#pensum-career').textContent = p.careerName;
        tpl.querySelector('#pensum-year').textContent = `Vigente desde: ${p.year}`;
        tpl.querySelector('.bg-gradient-to-br').addEventListener('click', () => {
            selectedPensum = p;
            renderPensumView();
        });
        container.appendChild(tpl);
    });
}

function renderPensumView() {
    if (!selectedPensum) return;
    const selectionContainer = document.querySelector('#pensum-selection');
    const viewContainer = document.querySelector('#pensum-view');
    const title = document.querySelector('#selected-pensum-title');
    const pensumContainer = document.querySelector('#pensum-container');

    selectionContainer.classList.add('hidden');
    viewContainer.classList.remove('hidden');
    title.textContent = `${selectedPensum.careerName} (${selectedPensum.year})`;
    pensumContainer.innerHTML = '';

    selectedPensum.cycles.forEach(c => {
        const cycleTpl = document.querySelector('#tmpl-pensum-cycle').content.cloneNode(true);
        cycleTpl.querySelector('.cycle-name').textContent = c.cycle;
        const subjContainer = cycleTpl.querySelector('#cycle-subjects');

        c.subjects.forEach(s => {
            const subjTpl = document.querySelector('#tmpl-pensum-subject').content.cloneNode(true);
            subjTpl.querySelector('#subject-code').textContent = s.code;
            subjTpl.querySelector('#subject-name').textContent = s.name;
            subjTpl.querySelector('#subject-uv').textContent = s.uv;
            subjContainer.appendChild(subjTpl);
        });

        pensumContainer.appendChild(cycleTpl);
    });
}