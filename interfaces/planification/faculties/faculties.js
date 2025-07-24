import { ROUTES } from './../../../js/helpers/routes.js';
import { FacultiesService } from './../../../js/services/faculties.js';
import { LocalitiesService } from './../../../js/services/localities.js';

export async function init() {
    const { Modal } = await import(ROUTES.components.modal.js);

    const facultyList = document.querySelector('#faculty-list');
    const addBtn = document.querySelector('#add-faculty-btn');

    const [faculties, localities] = await Promise.all([
        FacultiesService.list(),
        LocalitiesService.list()
    ]);

    const localitiesMap = localities.reduce((map, loc) => {
        map[loc.localityID] = loc;
        return map;
    }, {});

    function renderFacultyCard(faculty) {
        const locality = localitiesMap[faculty.localityID] || {};

        const card = document.createElement('div');
        card.className =
            'bg-gradient-to-tr from-indigo-50 to-blue-50 rounded-lg shadow p-6 w-80 flex flex-col justify-between';

        card.innerHTML = `
            <h3 class="font-semibold text-indigo-700 mb-1">${faculty.facultyName}</h3>
            <p class="text-sm text-indigo-500 mb-1">Código: ${faculty.facultyCode || '-'}</p>
            <p class="text-sm text-indigo-500 mb-1">Teléfono: ${faculty.contactPhone || '-'}</p>

            <div class="mt-4 p-3 bg-indigo-100 rounded-md">
                <h4 class="font-semibold text-indigo-600 mb-1">Localidad</h4>
                <p class="text-sm text-indigo-600 mb-0.5">${locality.address || 'N/A'}</p>
                <p class="text-sm text-indigo-600 mb-0.5">Teléfono: ${locality.phoneNumber || 'N/A'}</p>
                ${locality.isMainLocality ? `<span class="inline-block mt-1 px-2 py-0.5 text-xs rounded bg-indigo-400 text-white font-semibold select-none">Sede principal</span>` : ''}
            </div>
        `;

        return card;
    }

    facultyList.innerHTML = '';
    faculties.forEach(fac => {
        facultyList.appendChild(renderFacultyCard(fac));
    });

    addBtn?.addEventListener('click', async () => {
        const modal = new Modal({ templateId: 'tmpl-add-faculty', size: 'md' });
        await modal.open();

        const localitySelect = modal.contentHost.querySelector('#faculty-locality');
        localitySelect.innerHTML = `<option value="" disabled selected>Selecciona la localidad</option>`;
        localities.forEach(loc => {
            const option = document.createElement('option');
            option.value = loc.localityID;
            option.textContent = `${loc.address} ${loc.isMainLocality ? '(Sede principal)' : ''}`;
            localitySelect.appendChild(option);
        });

        modal.contentHost.querySelector('#cancel-btn')?.addEventListener('click', () => modal.close());

        modal.contentHost.querySelector('#faculty-form')?.addEventListener('submit', async e => {
            e.preventDefault();

            const form = e.target;
            const data = {
                facultyName: form.name.value.trim(),
                facultyCode: form.code.value.trim(),
                contactPhone: form.phone.value.trim(),
                localityID: form.localityID.value
            };

            if (!data.facultyName || !data.localityID) {
                alert('Por favor completa los campos obligatorios');
                return;
            }

            try {
                await FacultiesService.create(data);
                alert('Facultad agregada correctamente');
                modal.close();
                const updatedFaculties = await FacultiesService.list();
                facultyList.innerHTML = '';
                updatedFaculties.forEach(fac => facultyList.appendChild(renderFacultyCard(fac)));
            } catch (error) {
                alert('Error al agregar facultad');
            }
        });
    });
}
