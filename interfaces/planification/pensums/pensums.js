import { Interface } from './../../base/interface.js';
import { PensaService } from './../../../js/services/pensa.service.js';

export default class PensumInterface extends Interface {

    static getTemplate() {
        return `
<main class="flex flex-col min-h-screen p-10 space-y-8 md:ml-80 pb-80 md:pb-56">

    <div class="flex items-center justify-between">
        <h1
            class="text-2xl font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow select-none py-3">
            Pensums Académicos
        </h1>
    </div>

    <div class="flex flex-col mb-10 lg:flex-row lg:items-end lg:gap-6">
        <div class="flex flex-col flex-1 mb-4 lg:mb-0">
            <label class="mb-1 text-xs font-semibold text-indigo-400 select-none">Carrera</label>
            <select id="filter-career"
                class="bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-4 py-3 rounded-lg text-indigo-500 shadow-md focus:outline-none">
                <option value="">Todas</option>
            </select>
        </div>

        <div class="flex flex-col flex-1 mb-4 lg:mb-0">
            <label class="mb-1 text-xs font-semibold text-indigo-400 select-none">Año</label>
            <select id="filter-year"
                class="bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-4 py-3 rounded-lg text-indigo-500 shadow-md focus:outline-none">
                <option value="">Todos</option>
            </select>
        </div>

        <div class="flex flex-col flex-1">
            <label class="mb-1 text-xs font-semibold text-indigo-400 select-none">Buscar asignatura</label>
            <input id="filter-subject" type="text" placeholder="Código o nombre"
                class="bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-4 py-3 rounded-lg text-indigo-500 shadow-md focus:outline-none placeholder:text-indigo-300 placeholder:italic">
        </div>

        <div
            class="block transition-shadow duration-300 bg-transparent group rounded-xl hover:bg-white hover:shadow-lg">
            <button id="search-pensums-btn" type="button"
                class="flex items-center gap-5 px-5 py-4 text-indigo-400 transition-colors duration-300 rounded-lg group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg"
                    class="flex-shrink-0 w-6 h-6 text-indigo-400 transition-colors duration-300 stroke-current group-hover:text-white drop-shadow fill-none"
                    viewBox="0 0 24 24" stroke-width="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                </svg>
                <span
                    class="hidden pr-1 font-medium transition-all duration-300 select-none lg:block group-hover:text-white drop-shadow">Buscar</span>
            </button>
        </div>
    </div>

    <section id="pensum-selection" class="flex flex-col gap-6"></section>

    <div id="pensum-view" class="hidden space-y-6">
        <button id="back-to-selection" class="mb-4 text-indigo-400 underline transition-all hover:text-blue-500">
            Volver a lista de pensums
        </button>
        <h2 id="selected-pensum-title"
            class="text-xl font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow select-none py-2">
        </h2>
        <div id="pensum-container" class="space-y-6"></div>
    </div>
</main>

<template id="tmpl-pensum-card">
    <div
        class="bg-gradient-to-br from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] rounded-xl p-6 shadow-md hover:shadow-lg transition-all cursor-pointer">
        <div class="flex items-center justify-between">
            <div>
                <h3 id="pensum-career"
                    class="font-semibold bg-gradient-to-r from-[rgb(var(--body-from))]0 to-[rgb(var(--body-to))]0 bg-clip-text text-transparent mb-1">
                </h3>
                <p id="pensum-year"
                    class="text-sm bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent font-semibold">
                </p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 text-indigo-400 transition-all group-hover:text-indigo-500" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path d="M9 5l7 7-7 7" />
            </svg>
        </div>
    </div>
</template>

<template id="tmpl-pensum-cycle">
    <div class="p-4 bg-white rounded-lg shadow-sm">
        <h2
            class="text-lg font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent mb-3 select-none">
            Ciclo <span class="cycle-name">-</span>
        </h2>
        <div class="grid gap-3 md:grid-cols-2 lg:grid-cols-3" id="cycle-subjects"></div>
    </div>
</template>

<template id="tmpl-pensum-subject">
    <div class="p-3 transition border border-indigo-100 rounded-lg cursor-pointer hover:shadow-md group">
        <div
            class="font-semibold bg-gradient-to-r from-[rgb(var(--body-from))]0 to-[rgb(var(--body-to))]0 bg-clip-text text-transparent drop-shadow">
            <span id="subject-code"></span> | <span id="subject-name"></span>
        </div>
        <div class="mt-1 text-xs text-indigo-400">
            <span class="italic">UV:</span> <span id="subject-uv">-</span>
        </div>
    </div>
</template>
        `;
    }

    async init() {
        this._bindEvents();
        this.allPensums = await PensaService.list();
        this._populateFilters(this.allPensums);
        this._renderPensums(this.allPensums);
    }

    _bindEvents() {
        const searchBtn = document.getElementById('search-pensums-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this._applyFilters());
        }

        const backBtn = document.getElementById('back-to-selection');
        if (backBtn) {
            backBtn.addEventListener('click', () => this._backToSelection());
        }
    }

    _populateFilters(pensums) {
        const careerSelect = document.getElementById('filter-career');
        const yearSelect = document.getElementById('filter-year');

        if (!careerSelect || !yearSelect) return;

        const careers = [...new Set(pensums.map(p => p.careerName))];
        const years = [...new Set(pensums.map(p => p.year))];

        careers.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c;
            opt.textContent = c;
            careerSelect.appendChild(opt);
        });

        years.forEach(y => {
            const opt = document.createElement('option');
            opt.value = y;
            opt.textContent = y;
            yearSelect.appendChild(opt);
        });
    }

    _applyFilters() {
        const career = document.querySelector('#filter-career').value;
        const year = document.querySelector('#filter-year').value;
        const subjectSearch = document.querySelector('#filter-subject').value.toLowerCase();

        const filtered = this.allPensums.filter(p => {
            const matchesCareer = !career || p.careerName === career;
            const matchesYear = !year || p.year.toString() === year;
            const matchesSubject = !subjectSearch || p.cycles.some(cycle =>
                cycle.subjects.some(s =>
                    s.code.toLowerCase().includes(subjectSearch) ||
                    s.name.toLowerCase().includes(subjectSearch)
                )
            );
            return matchesCareer && matchesYear && matchesSubject;
        });

        this._renderPensums(filtered);
    }

    _renderPensums(pensums) {
        const container = document.getElementById('pensum-selection');
        if (!container) return;
        container.innerHTML = '';

        pensums.forEach(p => {
            const tmpl = document.getElementById('tmpl-pensum-card');
            if (!tmpl) return;
            const card = tmpl.content.cloneNode(true);

            card.querySelector('#pensum-career').textContent = p.careerName;
            card.querySelector('#pensum-year').textContent = p.year;

            card.querySelector('.bg-gradient-to-br').addEventListener('click', () => {
                this._showPensum(p);
            });

            container.appendChild(card);
        });
    }

    _showPensum(pensum) {
        const selection = document.getElementById('pensum-selection');
        const view = document.getElementById('pensum-view');
        const title = document.getElementById('selected-pensum-title');
        const container = document.getElementById('pensum-container');

        if (!selection || !view || !title || !container) return;

        selection.classList.add('hidden');
        view.classList.remove('hidden');

        title.textContent = `${pensum.careerName} - ${pensum.year}`;
        container.innerHTML = '';

        pensum.cycles.forEach(cycle => {
            const tmplCycle = document.getElementById('tmpl-pensum-cycle');
            const cycleNode = tmplCycle.content.cloneNode(true);
            cycleNode.querySelector('.cycle-name').textContent = cycle.cycle;

            const subjContainer = cycleNode.querySelector('#cycle-subjects');
            cycle.subjects.forEach(s => {
                const tmplSubj = document.getElementById('tmpl-pensum-subject');
                const subjNode = tmplSubj.content.cloneNode(true);
                subjNode.querySelector('#subject-code').textContent = s.code;
                subjNode.querySelector('#subject-name').textContent = s.name;
                subjNode.querySelector('#subject-uv').textContent = s.uv;
                subjContainer.appendChild(subjNode);
            });

            container.appendChild(cycleNode);
        });
    }

    _backToSelection() {
        const selection = document.getElementById('pensum-selection');
        const view = document.getElementById('pensum-view');
        if (!selection || !view) return;

        selection.classList.remove('hidden');
        view.classList.add('hidden');
    }

}
