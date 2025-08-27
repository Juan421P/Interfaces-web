// notifications.js
import { ROUTES } from '../../js/lib/routes.js';
import { NotificationsService } from '../../js/services/notifications.service.js';
import { UsersService } from './../../js/services/users.service.js';
import { formatDate } from './../../js/lib/index.js';

const { Modal } = await import(ROUTES.components.modal.js);
const { Toast } = await import(ROUTES.components.toast.js);
const { Button } = await import(ROUTES.components.button.js);
const { Form } = await import(ROUTES.components.form.js);
const { FormInput } = await import(ROUTES.components.formInput.js);
const { Cards } = await import(ROUTES.components.cards.js);

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
                const modal = new Modal({
                    size: 'md',
                    content: new Form({
                        inputs: [
                            new FormInput({
                                id: 'title',
                                label: 'Título',
                                placeholder: 'Título',
                                validationMethod: 'simpleText',
                                required: true,
                            }),
                            new FormInput({
                                id: 'message',
                                label: 'Mensaje',
                                placeholder: 'Mensaje',
                                textarea: true,
                                rows: 4,
                                validationMethod: 'normalText',
                                required: true,
                            })
                        ],
                        onSubmit: async (formData) => {
                            const title = (formData.title || '').trim();
                            const message = (formData.message || '').trim();

                            const payload = {
                                title,
                                body: message, // matches API
                                userName: `${user.firstName} ${user.lastName}`,
                                sentAt: new Date().toISOString()
                            };

                            try {
                                await NotificationsService.create(payload);
                                toast.show('¡Notificación enviada! ✨');
                                modal.close();
                                // cards will auto-refresh if NotificationsService dispatches event
                            } catch (error) {
                                toast.show('Error al registrar los datos 😔');
                                console.error(error);
                            }
                        }
                    }),
                    renderMode: 'component',
                    id: 'add-notification-modal'
                });
            }
        });
    }

    new Cards({
        host: '#notifications-list',
        service: NotificationsService,
        serviceEventPrefix: 'Notifications',
        templateId: '#notification-tmpl',
        bindings: [
            { selector: '.title', key: 'title', mode: 'text' },
            { selector: '.body', key: 'body', mode: 'text' },
            { selector: '.sentAt', key: 'sentAt', mode: 'text', transform: formatDate },
        ]
    });
}
