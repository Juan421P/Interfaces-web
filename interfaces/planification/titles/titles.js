import { ROUTES } from './../../../js/lib/routes.js';
import { TitlesService } from './../../../js/services/titles.js';
import { Toast } from './../../../components/toast/toast.js';

export async function init() {
    const { Modal } = await import(ROUTES.components.modal.js);
    const toast = new Toast();
    await toast.init();

    const list = document.querySelector('#titles-list');
    const addBtn = document.querySelector('#add-title-btn');

    async function render() {
        const titles = await TitlesService.list();
        list.innerHTML = '';
        titles.forEach(t => {
            const tpl = document.querySelector('#tmpl-title-card').content.cloneNode(true);
            tpl.querySelector('#title-name').textContent = t.degreeTypeName;
            tpl.querySelector('#title-id').textContent = `ID: ${t.degreeTypeID}`;
            list.appendChild(tpl);
        });
    }

    addBtn.addEventListener('click', async () => {
        const modal = new Modal({ templateId: 'tmpl-add-title', size: 'md' });
        await modal.open();

        modal.contentHost.querySelector('#cancel-btn').addEventListener('click', () => modal.close());
        modal.contentHost.querySelector('#title-form').addEventListener('submit', async e => {
            e.preventDefault();
            const name = e.target.querySelector('#title-name-input').value.trim();
            if (!name) return toast.show('El nombre es obligatorio', 5000);

            try {
                await TitlesService.create({ degreeTypeName: name });
                toast.show('Título agregado correctamente');
                modal.close();
                await render();
            } catch {
                toast.show('Error al agregar título');
            }
        });
    });

    await render();
}
