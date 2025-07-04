import { ROUTES } from './../../js/helpers/routes.js';
import { NotificationsService } from './../../js/services/notifications.js';

export async function init() {
    const { Notification } = await import(ROUTES.components.notification.js);
    const container = document.querySelector('#notifications-list');
    if (!container) {
        console.warn('[Notifications] #notifications-list not found :(');
        return;
    }
    container.innerHTML = '';

    try {
        const notifications = await NotificationsService.list();
        if (!Array.isArray(notifications) || notifications.length === 0) {
            container.innerHTML = '<p class="text-indigo-400">No hay notificaciones 😅</p>';
            return;
        }
        for (const notif of notifications) {
            const notification = new Notification({ data: notif });
            const element = await notification.render();
            container.appendChild(element);
        }
    } catch (error) {
        container.innerHTML = '<p class="text-red-500">No se pudieron cargar las notificaciones.</p>';
        console.error(error);
    }
}