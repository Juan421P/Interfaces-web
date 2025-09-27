import { ROUTES } from '../../js/lib/routes.js';
import { AuthService } from '../../js/services/auth.service.js';
import { NotificationsService } from '../../js/services/notifications.service.js';

const { Modal } = await import(ROUTES.components.modal.js);
const { Toast } = await import(ROUTES.components.toast.js);
const { Button } = await import(ROUTES.components.button.js);
const { Form } = await import(ROUTES.components.form.js);
const { FormInput } = await import(ROUTES.components.formInput.js);
const { SubmitInput } = await import(ROUTES.components.submitInput.js);
const { CardContainer } = await import(ROUTES.components.cardContainer.js);

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

                        const plain = JSON.parse(JSON.stringify(payload));
                        const validation = NotificationsContract.validate(plain, 'create');
                        if (!validation.ok) {
                            console.error('Contract validation failed:', validation.errors);
                            return;
                        }

                        try {
                            const parsed = NotificationsContract.parse(plain, 'create');
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

    const user = (await AuthService.me()).user;
    if (!user) {
        toast.show('Usuario no autenticado 😭');
        window.location.hash = '#login';
        return;
    }

    if (user.roleID === 'Administrador') {
        new Button({
            host: '#add-notification-btn-container',
            text: 'Agregar noticia',
            collapseText: true,
            buttonType: 1,
            onClick: () => {
                openNotificationForm('create');
            }
        });
    }

    const cards = new CardContainer({
        host: "#notifications-container",
        service: NotificationsService,
        servicePrefix: 'Notifications',
        fields: [
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
                onClick: () => openNotificationForm({
                    mode: 'update',
                    data: row
                })
            },
            {
                label: "Eliminar",
                className: "text-red-600",
                onClick: async () => {
                    await NotificationsService.delete(row.notificationID);
                    toast.show("Notificación eliminada 💔");
                    cards.reload();
                }
            }
        ]
    });

}
