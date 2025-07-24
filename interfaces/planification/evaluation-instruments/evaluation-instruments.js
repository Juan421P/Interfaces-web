import { ROUTES } from './../../../js/helpers/routes.js';
import { InstrumentsService } from './../../../js/services/instruments.js';
import { Toast } from './../../../components/toast/toast.js';

export async function init() {
    const { Modal } = await import(ROUTES.components.modal.js);
    const toast = new Toast();
    await toast.init();

    const list = document.querySelector('#instruments-list');
    const addBtn = document.querySelector('#add-instrument-btn');

    async function render() {
        const instruments = await InstrumentsService.list();
        list.innerHTML = '';
        instruments.forEach(i => {
            const tpl = document.querySelector('#tmpl-instrument-card').content.cloneNode(true);
            tpl.querySelector('#instrument-name').textContent = i.instrumentName;
            tpl.querySelector('#instrument-type').textContent = `Tipo: ${i.type}`;
            list.appendChild(tpl);
        });
    }

    addBtn.addEventListener('click', async () => {
        const modal = new Modal({ templateId: 'tmpl-add-instrument', size: 'md' });
        await modal.open();

        modal.contentHost.querySelector('#cancel-btn').addEventListener('click', () => modal.close());
        modal.contentHost.querySelector('#instrument-form').addEventListener('submit', async e => {
            e.preventDefault();
            const name = e.target.querySelector('#instrument-name-input').value.trim();
            const type = e.target.querySelector('#instrument-type-input').value.trim();
            if (!name || !type) return toast.show('Todos los campos son obligatorios', 5000);

            try {
                await InstrumentsService.create({ instrumentName: name, type });
                toast.show('Instrumento agregado correctamente');
                modal.close();
                await render();
            } catch {
                toast.show('Error al agregar instrumento');
            }
        });
    });

    await render();
}
