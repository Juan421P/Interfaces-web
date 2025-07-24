import { ROUTES } from './../../../js/helpers/routes.js';
import { ModalitiesService } from './../../../js/services/modalities.js';

export async function init() {
    const { Modal } = await import(ROUTES.components.modal.js);

    const listContainer = document.querySelector('#modalities-list');
    const addBtn = document.querySelector('#add-modality-btn');

    const modalities = await ModalitiesService.list();
    renderModalities(modalities);

    function renderModalities(modalities) {
        listContainer.innerHTML = '';
        modalities.forEach(m => {
            const tpl = document.querySelector('#tmpl-modality-card').content.cloneNode(true);
            tpl.querySelector('#modality-name').textContent = m.modalityName;
            listContainer.appendChild(tpl);
        });
    }

    addBtn.addEventListener('click', async () => {
        const modal = new Modal({ templateId: 'tmpl-add-modality', size: 'sm' });
        await modal.open();

        modal.contentHost.querySelector('#cancel-btn')?.addEventListener('click', () => modal.close());

        modal.contentHost.querySelector('#modality-form')?.addEventListener('submit', async e => {
            e.preventDefault();
            const form = e.target;

            const data = {
                modalityName: form.modalityName.value.trim()
            };

            if (!data.modalityName) {
                alert('Por favor completa los campos obligatorios');
                return;
            }

            try {
                await ModalitiesService.create(data);
                alert('Modalidad agregada correctamente');
                modal.close();
                const updated = await ModalitiesService.list();
                renderModalities(updated);
            } catch {
                alert('Error al agregar modalidad');
            }
        });
    });
}
