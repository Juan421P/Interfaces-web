import { ROUTES } from './../../../js/helpers/routes.js';
import { RolesService } from './../../../js/services/roles.js';

const { Modal } = await import(ROUTES.components.modal.js);
const { Button } = await import(ROUTES.components.button.js)
const { Toast } = await import(ROUTES.components.toast.js);
const toast = new Toast();
await toast.init();

export async function init() {

    const addRoleBtn = new Button({
        host: '#add-role-btn-container',
        text: 'Agregar rol',
        buttonType: 1,
        onClick: async () => {
            const modal = new Modal({ templateId: 'tmpl-add-role', size: 'sm' });
            await modal.open();
        }
    });

    async function render() {
        const roles = await RolesService.list();
        const list = document.querySelector('#role-list');
        list.innerHTML = '';
        roles.forEach(role => {
            const tpl = document.querySelector('#tmpl-role-card').content.cloneNode(true);
            tpl.querySelector('#document-name').textContent = role.roleName;
            tpl.querySelector('#document-description').textContent = formatRoleType(role.roleType);
            list.appendChild(tpl);
        });
    }

    await render();

}

function formatRoleType(type) {
    switch (type) {
        case 'admin': return 'Administrador';
        case 'ar': return 'Registro Académico';
        case 'teacher': return 'Docente';
        case 'hr': return 'Recursos Humanos';
        case 'student': return 'Estudiante';
        default: return '—';
    }
}
