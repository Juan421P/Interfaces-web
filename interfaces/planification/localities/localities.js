import { ROUTES } from './../../../js/lib/routes.js';
import { LocalitiesService } from './../../../js/services/localities.js';

export async function init() {
    const { Modal } = await import(ROUTES.components.modal.js);

    const listContainer = document.querySelector('#localities-list');
    const addBtn = document.querySelector('#add-locality-btn');

    const localities = await LocalitiesService.list();
    renderLocalities(localities);

    function renderLocalities(localities) {
        listContainer.innerHTML = '';
        localities.forEach(loc => {
            const tpl = document.querySelector('#tmpl-locality-card').content.cloneNode(true);

            tpl.querySelector('#locality-address').textContent = loc.address;
            tpl.querySelector('#locality-phone').textContent = loc.phoneNumber || '-';
            if (loc.isMainLocality) {
                tpl.querySelector('#main-locality-badge').classList.remove('hidden');
            }

            listContainer.appendChild(tpl);
        });
    }

    addBtn.addEventListener('click', async () => {
        const modal = new Modal({ templateId: 'tmpl-add-locality', size: 'md' });
        await modal.open();

        modal.contentHost.querySelector('#cancel-btn')?.addEventListener('click', () => modal.close());

        modal.contentHost.querySelector('#locality-form')?.addEventListener('submit', async e => {
            e.preventDefault();
            const form = e.target;

            const data = {
                address: form.address.value.trim(),
                phoneNumber: form.phoneNumber.value.trim(),
                isMainLocality: form.isMainLocality.checked
            };

            if (!data.address) {
                alert('Por favor completa los campos obligatorios');
                return;
            }

            try {
                await LocalitiesService.create(data);
                alert('Localidad agregada correctamente');
                modal.close();
                const updated = await LocalitiesService.list();
                renderLocalities(updated);
            } catch (error) {
                alert('Error al agregar localidad');
            }
        });
    });
}
