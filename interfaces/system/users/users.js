import { ROUTES } from './../../../js/helpers/routes.js';
import { UsersService } from './../../../js/services/users.js';

const { Modal } = await import(ROUTES.components.modal.js);
const { Toast } = await import(ROUTES.components.toast.js);
const { Table } = await import(ROUTES.components.table.js);
const { Button } = await import(ROUTES.components.button.js);

const HEADERS = ['ID', 'Nombre', 'Correo', 'Tipo', 'Detalle'];

const toast = new Toast();
await toast.init();

await new Table({
    host: '#user-table',
    headers: ['ID', 'Nombre', 'Correo'],
    data: (await UsersService.listMockup()).map(u => [
        u.userID,
        `${u.firstName} ${u.lastName}`,
        u.email
    ]),
    searchable: true,
    sortable: false,
    paginated: true,
    perPage: 10,
    searchFields: [1, 2]
});

export async function init() {

    document.querySelectorAll('.user-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.user-filter-btn').forEach(b => b.classList.remove('bg-indigo-50'));
            btn.classList.add('bg-indigo-50');
            applyFilter(btn.dataset.type);
        })
    });

    new Button({
        host: '#add-user-btn-container',
        text: 'Agregar usuario',
        collapseText: true,
        onClick: async () => {
            const modal = new Modal({ templateId: 'tmpl-add-user', size: 'sm' });
            await modal.open();
        }
    });
}