import { ROUTES } from './../../../js/lib/routes.js';
import { GradesService } from './../../../js/services/grades.js';
import { Toast } from './../../../components/toast/toast.js';

export async function init() {
    const { Modal } = await import(ROUTES.components.modal.js);
    const toast = new Toast();
    await toast.init();

    const list = document.querySelector('#grades-list');
    const addBtn = document.querySelector('#add-grade-btn');

    async function render() {
        const grades = await GradesService.list();
        list.innerHTML = '';
        grades.forEach(g => {
            const tpl = document.querySelector('#tmpl-grade-card').content.cloneNode(true);
            tpl.querySelector('#grade-name').textContent = g.academicLevelName;
            list.appendChild(tpl);
        });
    }

    addBtn.addEventListener('click', async () => {
        const modal = new Modal({ templateId: 'tmpl-add-grade', size: 'md' });
        await modal.open();

        modal.contentHost.querySelector('#cancel-btn').addEventListener('click', () => modal.close());
        modal.contentHost.querySelector('#grade-form').addEventListener('submit', async e => {
            e.preventDefault();
            const name = e.target.querySelector('#grade-name-input').value.trim();
            if (!name) return toast.show('El nombre es obligatorio', 5000);

            try {
                await GradesService.create({ academicLevelName: name });
                toast.show('Grado agregado correctamente');
                modal.close();
                await render();
            } catch {
                toast.show('Error al agregar grado');
            }
        });
    });

    await render();
}
