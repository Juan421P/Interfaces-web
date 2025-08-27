import { ROUTES } from '../../js/lib/routes.js';
import { NotificationsService } from '../../js/services/notifications.service.js';
import { UsersService } from './../../js/services/users.service.js';

const { Modal } = await import(ROUTES.components.modal.js);
const { Toast } = await import(ROUTES.components.toast.js);
const { Button } = await import(ROUTES.components.button.js);
const { Form } = await import(ROUTES.components.form.js);
const { FormInput } = await import(ROUTES.components.formInput.js);
const { Cards } = await import(ROUTES.components.cards.js);

export async function init() {

    const toast = new Toast();
    await toast.init();

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
                    onSubmit: async (formData, formInstance) => {
                        const title = formData.title.trim();
                        const message = formData.message.trim();

                        if (!isValidTitle(title) || !isValidMessage(message)) {
                            toast.show('Por favor, complete los campos correctamente');
                            return;
                        }

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

                        const data = {
                            title,
                            content: message,
                            sender: `${user.firstName} ${user.lastName}`,
                            sentAt: new Date().toISOString(),
                            senderPicture: user.image,
                        };

                        try {
                            await NotificationsService.create(data);
                            toast.show('¡Notificación enviada! ✨');
                            modal.close();
                            await loadNotifications();
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

    const cards = new Cards({
        host: '#notifications-list',
        service: NotificationsService,
        templateId: '#notification-tmpl',
        bindings: [
            { selector: 'img', key: 'senderPicture', mode: 'attr', attr: 'src' },
            { selector: 'img', key: 'sender', mode: 'attr', attr: 'alt' },
            { selector: 'p:nth-of-type(1)', key: 'title' },
            { selector: 'p:nth-of-type(2)', key: 'content' },
            { selector: 'span', key: 'sentAt' }
        ]
    });

    await cards.reload();

}