import { ROUTES } from './../../../js/lib/routes.js';
import { DepartmentsService } from './../../../js/services/departments.js';
import { FacultiesService } from './../../../js/services/faculties.js';

export async function init() {
    const { Modal } = await import(ROUTES.components.modal.js);

    const departmentList = document.querySelector('#department-list');
    const addBtn = document.querySelector('#add-department-btn');

    const [departments, faculties] = await Promise.all([
        DepartmentsService.list(),
        FacultiesService.list()
    ]);

    const facultiesMap = faculties.reduce((map, f) => {
        map[f.facultyID] = f;
        return map;
    }, {});

    function renderDepartmentCard(department) {
        const faculty = facultiesMap[department.facultyID] || {};
        const card = document.createElement('div');
        card.className =
            'bg-gradient-to-tr from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] rounded-lg shadow p-6 w-80 flex flex-col justify-between';

        card.innerHTML = `
      <h3 class="font-semibold text-indigo-700 mb-1">${department.departmentName}</h3>
      <p class="text-sm text-indigo-500 mb-1">Tipo: ${department.departmentType || '-'}</p>
      <p class="text-sm text-indigo-500">Facultad: ${faculty.facultyName || '-'}</p>
    `;

        return card;
    }

    departmentList.innerHTML = '';
    departments.forEach(dep => departmentList.appendChild(renderDepartmentCard(dep)));

    addBtn?.addEventListener('click', async () => {
        const modal = new Modal({ templateId: 'tmpl-add-department', size: 'md' });
        await modal.open();

        const facultySelect = modal.contentHost.querySelector('#department-faculty');
        facultySelect.innerHTML = `<option value="" disabled selected>Selecciona la facultad</option>`;
        faculties.forEach(f => {
            const option = document.createElement('option');
            option.value = f.facultyID;
            option.textContent = f.facultyName;
            facultySelect.appendChild(option);
        });

        modal.contentHost.querySelector('#cancel-btn')?.addEventListener('click', () => modal.close());

        modal.contentHost.querySelector('#department-form')?.addEventListener('submit', async e => {
            e.preventDefault();
            const form = e.target;

            const data = {
                departmentName: form.name.value.trim(),
                departmentType: form.type.value.trim(),
                facultyID: form.facultyID.value
            };

            if (!data.departmentName || !data.departmentType || !data.facultyID) {
                alert('Por favor completa todos los campos obligatorios');
                return;
            }

            try {
                await DepartmentsService.create(data);
                alert('Departamento agregado correctamente');
                modal.close();

                const updatedDepartments = await DepartmentsService.list();
                departmentList.innerHTML = '';
                updatedDepartments.forEach(dep => departmentList.appendChild(renderDepartmentCard(dep)));
            } catch (error) {
                alert('Error al agregar departamento');
            }
        });
    });
}
