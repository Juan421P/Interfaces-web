import { ROUTES } from '../../js/lib/routes.js';
import { NotificationsService } from '../../js/services/notifications.service.js';
import { UsersService } from './../../js/services/users.service.js';
import { formatDate } from './../../js/lib/index.js';

const { Modal } = await import(ROUTES.components.modal.js);
const { Toast } = await import(ROUTES.components.toast.js);
const { Button } = await import(ROUTES.components.button.js);
const { Form } = await import(ROUTES.components.form.js);
const { FormInput } = await import(ROUTES.components.formInput.js);
const { SubmitInput } = await import(ROUTES.components.submitInput.js);
const { Table } = await import(ROUTES.components.table.js);

function openNotificationForm({ mode = 'create', data = null } = {}) {
    const modal = new Modal({
        id: 'notification-form-modal',
        size: 'lg',
        renderMode: 'component',
        components: [
            {
                type: Form,
                opts: {
                    host: '#form-container',
                    templateId: 'form-template',
                    components: [
                        {
                            type: FormInput,
                            opts: {
                                id: 'title',
                                placeholder: 'Ingrese un título',
                                type: 'text'
                            }
                        },
                        {
                            type: FormInput,
                            opts: {
                                id: 'body',
                                placeholder: 'Ingrese el mensaje',
                                type: 'textarea',
                                rows: 5
                            }
                        },
                        {
                            type: SubmitInput,
                            opts: {
                                id: 'submit',
                                text: 'Añadir',
                                removeIcon: true,
                                additionalClasses: 'text-sm px-4 py-2'
                            }
                        }
                    ],
                    onSubmit: async (values, errors) => {
                        const userID = sessionStorage.getItem('userID');
                        const user = await UsersService.get(userID);
                        if (!user) { console.error('User not found'); return; }

                        const payload = {
                            userID,
                            userName: `${user.personName} ${user.personLastName}`,
                            title: String(values.title ?? ''),
                            body: String(values.body ?? ''),
                            sentAt: new Date().toISOString().slice(0, 10)
                        };

                        console.log('payload (raw):', payload);
                        console.log('keys:', Object.keys(payload));
                        console.log('ownProps (getOwnPropertyNames):', Object.getOwnPropertyNames(payload));
                        console.log('types:', {
                            title: typeof payload.title,
                            body: typeof payload.body,
                            sentAt: typeof payload.sentAt
                        });

                        const plain = JSON.parse(JSON.stringify(payload));
                        console.log('plain copy keys:', Object.keys(plain));

                        const validation = NotificationsContract.validate(plain, 'create');
                        console.log('contract.validate =>', validation);

                        if (!validation.ok) {
                            console.error('Contract validation failed:', validation.errors);
                            return;
                        }

                        try {
                            const parsed = NotificationsContract.parse(plain, 'create');
                            console.log('contract.parse =>', parsed);
                            await NotificationsService.create(parsed);
                        } catch (err) {
                            console.error('parse or create failed', err, plain);
                            throw err;
                        }
                        
                        modal.close();
                    }
                }
            }
        ]
    });

    if (mode === 'update' && data) {
        const form = modal.content[0];
        form.getField('title')?.setValue(data.title || '');
        form.getField('body')?.setValue(data.body || '');
    }
}

export async function init() {
    const toast = new Toast();
    await toast.init();

    const userID = sessionStorage.getItem('userID');
    if (!userID) {
        toast.show('Ningún usuario inició sesión 🥺');
        window.location.href = '/interfaces/login/login.html';
        return;
    }

    const user = await UsersService.get(userID);
    if (!user) {
        toast.show('Usuario no autenticado 😭');
        return;
    }

    if (user.rolesName === 'administrador') {
        new Button({
            host: '#add-notification-btn-container',
            text: 'Agregar notificación',
            collapseText: true,
            buttonType: 1,
            onClick: () => {
                openNotificationForm('create');
            }
        });
    }

    const table = new Table({
        host: "#notifications-table",
        service: NotificationsService,
        servicePrefix: 'Notifications',
        headers: [
            { label: "Título", key: "title" },
            { label: "Mensaje", key: "body" },
            { label: "Usuario", key: "userName" },
            { label: "Enviado", key: "sentAt" }
        ],
        searchable: true,
        paginated: true,
        perPage: 10,
        contextMenu: true,
        contextMenuOpts: (row) => [
            {
                label: "Actualizar",
                onClick: () => openNotificationForm({ mode: 'update', data: row })
            },
            {
                label: "Eliminar",
                className: "text-red-600",
                onClick: async () => {
                    await NotificationsService.delete(row.notificationID);
                    toast.show("Notificación eliminada 💔");
                    table.reload();
                }
            }
        ]
    });

}
