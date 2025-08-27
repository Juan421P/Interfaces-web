import { fetchJSON, postJSON, putJSON } from './../lib/network.js';
import { NotificationsContract } from './../contracts/notifications.contract.js';

const ENDPOINT = '/Notifications';

export const NotificationsService = {
    contract: NotificationsContract,

    async list() {
        const notification = await fetchJSON(`${ENDPOINT}/getNotifications`);
        document.dispatchEvent(new CustomEvent('Notifications:list', {
            detail: notification
        }));
        return Array.isArray(notification) ? notification.map(n => NotificationsContract.parse(n, 'table')) : [];
    },

    async create(data) {
        const payload = NotificationsContract.parse(data, 'create');
        const notification = await postJSON(`${ENDPOINT}`, payload);
        document.dispatchEvent(new CustomEvent('Notifications:create', {
            detail: notification
        }));
        return Array.isArray(notification) ? notification.map(n => NotificationsContract.parse(n, 'table')) : [];
    },

    async update(data) {
        const payload = NotificationsContract.parse(data, 'update');
        const notification = await putJSON(`${ENDPOINT}/${payload.notificationID}`, payload);
        document.dispatchEvent(new CustomEvent('Notifications:update', {
            detail: notification
        }));
        return Array.isArray(notification) ? notification.map(n => NotificationsContract.parse(n, 'table')) : [];
    },
};