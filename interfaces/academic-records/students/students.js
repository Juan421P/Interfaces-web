import { Interface } from './../../base/interface.js';
import { StudentService } from './../../../js/services/students.service.js';

export default class StudentsInterface extends Interface {

    static getTemplate() {
        return `
            <main class="flex flex-col min-h-screen p-10 space-y-8 md:ml-80 pb-80 md:pb-56">
                <div class="flex items-center justify-between">
                    <h1 class="text-2xl font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow select-none">
                        Gestión de Estudiantes
                    </h1>
                    <div class="block transition-shadow duration-300 bg-transparent group rounded-xl hover:bg-white hover:shadow-lg">
                        <button id="add-student-btn" type="button" class="flex items-center gap-5 px-5 py-4 text-indigo-400 transition-colors duration-300 rounded-lg group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-blue-400">
                            <svg xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0 w-6 h-6 text-indigo-400 transition-colors duration-300 stroke-current group-hover:text-white drop-shadow fill-none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M8 12h8" />
                                <path d="M12 8v8" />
                            </svg>
                            <span class="hidden pr-1 font-medium transition-all duration-300 select-none lg:block group-hover:text-white drop-shadow">
                                Agregar estudiante
                            </span>
                        </button>
                    </div>
                </div>
                <div class="sm:max-w-xs">
                    <input id="student-search" type="text" placeholder="Buscar" class="w-full bg-gradient-to-r from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] px-4 py-3 rounded-lg focus:outline-none text-indigo-500 placeholder:text-indigo-300 placeholder:italic text-shadow shadow-md border-none select-none focus:ring-0" />
                </div>
                <div id="student-table" class="mt-4"></div>
        </main>
        <template id="tmpl-add-student">
            <div class="max-w-md p-10 mx-auto">
                <h2 class="text-2xl font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow mb-6">
                    Nuevo estudiante
                </h2>
                <p class="text-indigo-400">
                    Formulario por implementar.
                </p>
            </div>
        </template>
        `;
    }

    async init() {
        this.service = new StudentService();
        await this.loadStudents();

        // Eventos
        document.getElementById('student-search')?.addEventListener('input', e => this._filterStudents(e.target.value));
        document.getElementById('add-student-btn')?.addEventListener('click', () => this._openStudentModal());
    }

    async loadStudents() {
        try {
            this.students = await this.service.getAll();
            this._renderStudentTable(this.students);
        } catch (error) {
            console.error('[StudentsInterface] Error cargando estudiantes:', error);
        }
    }

    _renderStudentTable(students) {
        const tableHost = document.getElementById('student-table');
        if (!tableHost) return;

        tableHost.innerHTML = `
            <table class="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead class="bg-indigo-50">
                    <tr>
                        <th class="p-3 text-left text-sm font-semibold text-indigo-600">Código</th>
                        <th class="p-3 text-left text-sm font-semibold text-indigo-600">Nombre</th>
                        <th class="p-3 text-left text-sm font-semibold text-indigo-600">Apellido</th>
                        <th class="p-3 text-left text-sm font-semibold text-indigo-600">Carrera</th>
                        <th class="p-3 text-left text-sm font-semibold text-indigo-600">Ciclo</th>
                        <th class="p-3 text-left text-sm font-semibold text-indigo-600">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${students.map(student => `
                        <tr class="border-t border-gray-200 hover:bg-indigo-50" data-id="${student.studentID}">
                            <td class="p-3 text-sm">${student.studentCode}</td>
                            <td class="p-3 text-sm">${student.personName}</td>
                            <td class="p-3 text-sm">${student.personLastName}</td>
                            <td class="p-3 text-sm">${student.careerId}</td>
                            <td class="p-3 text-sm">${student.yearCycleId}</td>
                            <td class="p-3 text-sm flex gap-2">
                                <button class="edit-btn text-blue-500 hover:underline">Editar</button>
                                <button class="delete-btn text-red-500 hover:underline">Eliminar</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        // Eventos editar/eliminar
        tableHost.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                const id = e.target.closest('tr').dataset.id;
                const student = this.students.find(s => s.studentID === id);
                this._openStudentModal(student);
            });
        });

        tableHost.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async e => {
                const id = e.target.closest('tr').dataset.id;
                if (confirm('¿Eliminar estudiante?')) {
                    await this.service.delete(id);
                    await this.loadStudents();
                }
            });
        });
    }

    _filterStudents(query) {
        query = query.toLowerCase();
        document.querySelectorAll('#student-table tbody tr').forEach(row => {
            const name = row.children[1].textContent.toLowerCase();
            const lastName = row.children[2].textContent.toLowerCase();
            row.style.display = (name.includes(query) || lastName.includes(query)) ? '' : 'none';
        });
    }

    _openStudentModal(student = null) {
        const modal = new Modal({
            templateId: 'tmpl-add-student',
            size: 'md'
        });

        const form = document.getElementById('student-form');
        if (!form) return;

        // Rellenar formulario si es edición
        if (student) {
            form.studentCode.value = student.studentCode;
            form.personName.value = student.personName;
            form.personLastName.value = student.personLastName;
            form.careerId.value = student.careerId;
            form.yearCycleId.value = student.yearCycleId;
        }

        form.onsubmit = async (e) => {
            e.preventDefault();
            const data = {
                studentCode: form.studentCode.value,
                personName: form.personName.value,
                personLastName: form.personLastName.value,
                careerId: form.careerId.value,
                yearCycleId: form.yearCycleId.value,
                personID: student?.personID || '', // requerido por el contract
                careerEnrollmentID: '',
                cycleEnrollmentID: '',
                performanceID: ''
            };

            if (student) {
                data.studentID = student.studentID;
                await this.service.update(data);
            } else {
                await this.service.create(data);
            }

            modal.close();
            await this.loadStudents();
        };
    }
}

/*import { Interface } from './../base/interface.js';
import { StudentService } from "../../../js/services/students.service";

export async function init() {
    toast = new (await import(ROUTES.components.toast.js)).Toast();
    await toast.init();

    const TableMod = await import(ROUTES.components.table.js);
    table = new TableMod.Table({
        host: '#student-table',
        headers: HEADERS,
        rows: [],
        searchable: true,
        sortable: true,
        paginated: true,
        perPage: 10,
        tableClasses: 'min-w-full text-sm table-fixed',
        headerClasses: 'px-4 py-3 font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow text-md',
        rowClasses: 'divide-y divide-indigo-100 text-indigo-700',
        columnClasses: ['text-right', '', '', '', ''],
        fixedLayout: true
    });
    await table.render();

    document.querySelector('#student-search')
        .addEventListener('input', e => table._renderBody(e.target.value.toLowerCase()));

    document.querySelector('#add-student-btn')
        .addEventListener('click', async () => {
            const { Modal } = await import(ROUTES.components.modal.js);
            const modal = new Modal({ templateId: 'tmpl-add-student', size: 'sm' });
            await modal.open();
        });

    await loadStudents();
}

async function loadStudents() {
    try {
        rawStudents = [
            {
                studentID: 1,
                firstName: 'Julio',
                lastName: 'Pérez',
                studentCode: 'JP25001',
                careerName: 'Ingeniería en Desarrollo de Software',
                email: 'julio.perez@ejemplo.com'
            },
            {
                studentID: 2,
                firstName: 'Gabriela',
                lastName: 'Córdova',
                studentCode: 'GC25001',
                careerName: 'Licenciatura en Diseño Gráfico',
                email: 'gabriela.cordova@ejemplo.com'
            }
        ];

        const rows = rawStudents.map(s => [
            s.studentID,
            `${s.firstName} ${s.lastName}`,
            s.studentCode,
            s.careerName ?? '—',
            s.email ?? '—'
        ]);
        table.setRows(rows);
    } catch (error) {
        toast.show('Error al cargar estudiantes', 4000);
        console.error(error);
    }
}*/