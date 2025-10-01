import { Interface } from "../../base/interface";
import { DocumentsService } from "../../../js/services/documents.service";
import { Modal } from "../../../components/components";
import { Toast } from "../../../components/components";

export default class DocumentInterface extends Interface {

    static getTemplate() {
        return `
        <main class="flex flex-col min-h-screen p-10 md:ml-80">
            <div class="flex items-center justify-between mb-10">
                <h1
                    class="text-2xl font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow select-none">
                    Documentos
                </h1>
                <div
                    class="block transition-shadow duration-300 bg-transparent group rounded-xl hover:bg-white hover:shadow-lg">
                    <button id="add-document-btn" type="button"
                        class="flex items-center gap-5 px-5 py-4 text-indigo-400 transition-colors duration-300 rounded-lg group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-blue-400">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            class="flex-shrink-0 w-6 h-6 text-indigo-400 stroke-current group-hover:text-white drop-shadow fill-none"
                            viewBox="0 0 24 24" stroke-width="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M8 12h8" />
                            <path d="M12 8v8" />
                        </svg>
                        <span
                            class="hidden font-medium transition-all duration-300 select-none lg:block group-hover:text-white drop-shadow">
                            Agregar documento
                        </span>
                    </button>
                </div>
            </div>
            <section id="documents-list" class="flex flex-wrap gap-6"></section>
        </main>
        <template id="tmpl-document-card">
            <div class="bg-gradient-to-tr from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] rounded-lg shadow p-6 w-64">
                <h3 class="mb-1 font-semibold text-indigo-700" id="document-name"></h3>
                <p class="text-sm text-indigo-500" id="document-description"></p>
            </div>
        </template>
        <template id="tmpl-add-document">
            <form id="document-form" class="flex flex-col max-w-md gap-10 px-6 py-10 mx-auto">
                <h2
                    class="text-2xl font-bold text-center bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow select-none">
                    Nuevo documento
                </h2>
                <input id="document-name-input" type="text"
                    class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-6 py-4 rounded-lg text-indigo-500 placeholder:text-indigo-300 placeholder:italic shadow-md"
                    placeholder="Ej: DUI, Título de Bachiller" required>
                <input id="document-description-input" type="text"
                    class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-6 py-4 rounded-lg text-indigo-500 placeholder:text-indigo-300 placeholder:italic shadow-md"
                    placeholder="Descripción breve" required>
                <div class="flex justify-end gap-3">
                    <button type="button" id="cancel-btn"
                        class="p-4 font-medium text-indigo-400 transition-all shadow-md bg-gradient-to-tr from-indigo-100 to-blue-100 rounded-xl hover:scale-105">
                        Cancelar
                    </button>
                    <button type="submit"
                        class="p-4 bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] text-white rounded-xl font-medium shadow-md hover:scale-105 transition-all">
                        Guardar
                    </button>
                </div>
            </form>
        </template>
        `;
    }

    constructor() {
        super();
        this.service = new DocumentsService();
        this.toast = new Toast();
    }

    async init() {
        await this.toast.init();

        this.listEl = document.querySelector("#documents-list");
        this.addBtn = document.querySelector("#add-document-btn");

        this.addBtn.addEventListener("click", () => this._openAddModal());

        await this._renderDocuments();
    }

    async _renderDocuments() {
        try {
            const documents = await this.service.getAll();
            this.listEl.innerHTML = "";

            documents.forEach(d => {
                const tpl = document.querySelector("#tmpl-document-card").content.cloneNode(true);
                tpl.querySelector("#document-name").textContent = d.documentName;
                tpl.querySelector("#document-description").textContent = d.description;
                this.listEl.appendChild(tpl);
            });
        } catch (err) {
            console.error("[DocumentInterface] Error cargando documentos:", err);
            this.toast.show("Error al cargar documentos", 4000);
        }
    }

    async _openAddModal() {
        const modal = new Modal({ templateId: "tmpl-add-document", size: "md" });

        modal.contentHost.querySelector("#cancel-btn").addEventListener("click", () => modal.close());

        modal.contentHost.querySelector("#document-form").addEventListener("submit", async e => {
            e.preventDefault();
            const name = e.target.querySelector("#document-name-input").value.trim();
            const desc = e.target.querySelector("#document-description-input").value.trim();

            if (!name || !desc) {
                return this.toast.show("Todos los campos son obligatorios", 5000);
            }

            try {
                await this.service.create({ documentName: name, description: desc });
                this.toast.show("Documento agregado correctamente");
                modal.close();
                await this._renderDocuments();
            } catch (err) {
                console.error("[DocumentInterface] Error al crear documento:", err);
                this.toast.show("Error al agregar documento");
            }
        });
    }
}
/*import { ROUTES } from './../../../js/lib/routes.js';
import { DocumentsService } from './../../../js/services/documents.js';
import { Toast } from './../../../components/toast/toast.js';

export async function init() {
    const { Modal } = await import(ROUTES.components.modal.js);
    const toast = new Toast();
    await toast.init();

    const list = document.querySelector('#documents-list');
    const addBtn = document.querySelector('#add-document-btn');

    async function render() {
        const documents = await DocumentsService.list();
        list.innerHTML = '';
        documents.forEach(d => {
            const tpl = document.querySelector('#tmpl-document-card').content.cloneNode(true);
            tpl.querySelector('#document-name').textContent = d.documentName;
            tpl.querySelector('#document-description').textContent = d.description;
            list.appendChild(tpl);
        });
    }

    addBtn.addEventListener('click', async () => {
        const modal = new Modal({ templateId: 'tmpl-add-document', size: 'md' });
        await modal.open();

        modal.contentHost.querySelector('#cancel-btn').addEventListener('click', () => modal.close());
        modal.contentHost.querySelector('#document-form').addEventListener('submit', async e => {
            e.preventDefault();
            const name = e.target.querySelector('#document-name-input').value.trim();
            const desc = e.target.querySelector('#document-description-input').value.trim();
            if (!name || !desc) return toast.show('Todos los campos son obligatorios', 5000);

            try {
                await DocumentsService.create({ documentName: name, description: desc });
                toast.show('Documento agregado correctamente');
                modal.close();
                await render();
            } catch {
                toast.show('Error al agregar documento');
            }
        });
    });

    await render();
}*/
