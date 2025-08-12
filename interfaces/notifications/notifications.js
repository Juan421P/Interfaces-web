import { ROUTES } from './../../js/helpers/routes.js';
import { NotificationsService } from './../../js/services/notifications.js';
import { UsersService } from './../../js/services/users.js';
import { checkInput, isValidNormalText as isValidMessage, isValidSimpleText as isValidTitle } from './../../js/helpers/index.js';

const { Modal } = await import(ROUTES.components.modal.js);
const { Toast } = await import(ROUTES.components.toast.js);
const { Button } = await import(ROUTES.components.button.js);
const { Form } = await import(ROUTES.components.form.js);
const { FormInput } = await import(ROUTES.components.formInput.js);

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

    const container = document.querySelector('#notifications-list');
    if (!container) {
        console.warn('[notifications.js] #notifications-list not found :(');
        return;
    }

    const notificationTemplateElement = document.querySelector('#notification-tmpl');
    if (!notificationTemplateElement) {
        console.error('[notifications.js]', 'Notification template (#notification-tmpl) not found in the DOM.');
        return;
    }
    const notificationTemplateHtml = notificationTemplateElement.innerHTML;

    async function loadNotifications() {
        container.innerHTML = '';

        try {
            const notifications = await NotificationsService.list();
            if (!Array.isArray(notifications) || notifications.length === 0) {
                container.innerHTML =
                    '<p class="text-indigo-400">No hay notificaciones 😅</p>';
                return;
            }
            for (const notif of notifications) {
                let renderedHtml = notificationTemplateHtml;

                Object.entries(notif).forEach(([key, value]) => {
                    renderedHtml = renderedHtml.replaceAll(`{{${key}}}`, String(value));
                });

                const tempContainer = document.createElement('template');
                tempContainer.innerHTML = renderedHtml.trim();

                const element = Array.from(tempContainer.content.children).find(n => n.nodeType === Node.ELEMENT_NODE) || tempContainer.content.firstElementChild;

                if (element) {
                    container.appendChild(element.cloneNode(true));
                }
            }
        } catch (error) {
            container.innerHTML =
                '<p class="text-red-500">No se pudieron cargar las notificaciones.</p>';
            console.error(error);
        }
    }

    await loadNotifications();

}