import { ROUTES } from './../../../js/helpers/routes.js';
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
}
