import { Interface } from './../base/interface.js';
import { SubjectsDefinitionService } from './../services/subjects-definition.service.js';

export default class SubjectsInterface extends Interface {

    static getTemplate() {
        return `
            <main class="flex flex-col min-h-screen p-10 md:ml-80">
                <div class="w-full space-y-8">
                    <div class="flex flex-col mb-10 lg:flex-row lg:items-end lg:gap-6">
                        <div class="flex flex-col flex-1 mb-4 lg:mb-0">
                            <label class="mb-1 text-xs font-semibold text-indigo-400 select-none">Buscar</label>
                            <input id="filter-subject" type="text" placeholder="Código o nombre"
                                class="bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] 
                                px-4 py-3 rounded-lg text-indigo-500 shadow-md focus:outline-none 
                                placeholder:text-indigo-300 placeholder:italic">
                        </div>

                        <div class="block transition-shadow duration-300 bg-transparent group rounded-xl hover:bg-white hover:shadow-lg">
                            <button id="search-subjects-btn" type="button"
                                class="flex items-center gap-5 px-5 py-4 text-indigo-400 transition-colors duration-300 
                                rounded-lg group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-blue-400">
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    class="flex-shrink-0 w-6 h-6 text-indigo-400 transition-colors duration-300 stroke-current 
                                    group-hover:text-white drop-shadow fill-none"
                                    viewBox="0 0 24 24" stroke-width="2">
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="m21 21-4.35-4.35" />
                                </svg>
                                <span class="hidden pr-1 font-medium transition-all duration-300 select-none 
                                    lg:block group-hover:text-white drop-shadow">Buscar</span>
                            </button>
                        </div>
                    </div>

                    <section id="subjects-list" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3"></section>
                </div>

                <template id="tmpl-subject-card">
                    <div
                        class="p-4 bg-gradient-to-br from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] 
                        rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer">
                        <div class="flex flex-col">
                            <h3 id="subject-name"
                                class="font-semibold bg-gradient-to-r from-[rgb(var(--text-from))] 
                                to-[rgb(var(--text-to))] bg-clip-text text-transparent mb-1">
                            </h3>
                            <p id="subject-code" class="text-sm text-indigo-400 font-semibold"></p>
                            <p id="subject-uv" class="text-xs text-indigo-500 mt-1"></p>
                        </div>
                    </div>
                </template>
            </main>
        `;
    }

    async init() {
        this.listContainer = document.getElementById("subjects-list");
        this.filterInput = document.getElementById("filter-subject");
        this.searchBtn = document.getElementById("search-subjects-btn");

        this.searchBtn.addEventListener("click", () => this.loadSubjects());
        this.filterInput.addEventListener("input", () => this.loadSubjects());

        await this.loadSubjects();
    }

    async loadSubjects() {
        this.listContainer.innerHTML = "";

        let subjects = await SubjectsDefinitionService.list();
        const filter = this.filterInput.value.toLowerCase();

        if (filter) {
            subjects = subjects.filter(s =>
                s.subjectName.toLowerCase().includes(filter) ||
                s.subjectCode.toLowerCase().includes(filter)
            );
        }

        const tmpl = document.getElementById("tmpl-subject-card");

        subjects.forEach(s => {
            const node = tmpl.content.cloneNode(true);
            node.getElementById("subject-name").textContent = s.subjectName;
            node.getElementById("subject-code").textContent = s.subjectCode;
            node.getElementById("subject-uv").textContent = `UV: ${s.valueUnits}`;
            this.listContainer.appendChild(node);
        });
    }
}
