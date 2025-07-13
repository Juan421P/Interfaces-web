import { ROUTES } from './../../js/helpers/routes.js';
import { NotificationsService } from './../../js/services/notifications.js';
import { storage } from './../../js/helpers/index.js';
import { checkInput, isValidNormalText as isValidMessage, isValidSimpleText as isValidTitle } from './../../js/helpers/index.js'

export async function init() {
    const { Notification } = await import(ROUTES.components.notification.js);
    const { Modal } = await import(ROUTES.components.modal.js);
    const { Toast } = await import(ROUTES.components.toast.js);

    const toast = new Toast();
    await toast.init();

    const container = document.querySelector('#notifications-list');
    if (!container) {
        console.warn('[Notifications] #notifications-list not found :(');
        return;
    }

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
                const notification = new Notification({ data: notif });
                const element = await notification.render();
                container.appendChild(element);
            }
        } catch (error) {
            container.innerHTML =
                '<p class="text-red-500">No se pudieron cargar las notificaciones.</p>';
            console.error(error);
        }
    }

    await loadNotifications();

    document.querySelector('#add-notification-btn')?.addEventListener('click', async () => {
        const modal = new Modal({ templateId: 'tmpl-add-notification', size: 'md' });
        await modal.open();

        checkInput('#notif-title', 'simpleText');
        checkInput('#notif-message', 'normalText');

        modal.contentHost.querySelector('#cancel-btn')?.addEventListener('click', () => modal.close());

        modal.contentHost.querySelector('#notification-form')?.addEventListener('submit', async e => {
            e.preventDefault();

            const title = e.target.title.value;
            const message = e.target.message.value;
            if (!isValidTitle(title) || !isValidMessage(message)) {
                console.warn('[Modal] Invalid input :(');
                return;
            }

            const user = storage.get('user');
            if (!user) {
                toast.show('Usuario no autenticado 😭');
            }

            const data = {
                title: title,
                content: message,
                sender: `${user.firstName} ${user.lastName}`,
                sentAt: new Date().toISOString(),
                senderPicture: user.image
            };

            try {
                await NotificationsService.create(data);
                toast.show('¡Notificación enviada! ✨');
                modal.close();
                loadNotifications();
                modal.contentHost.querySelector('#notification-form').reset();
            } catch (error) {
                toast.show('Error al registrar los datos 😔');
            }
        })
    });

}