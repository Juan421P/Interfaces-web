import { fetchJSON, postJSON, putJSON } from './../lib/network.js';
import { NotificationsContract } from './../contracts/notifications.contract.js';

const ENDPOINT = '/Notifications';

export const NotificationsService = {
    contract: NotificationsContract,

    async list() {
        const notification = await fetchJSON(
            `${ENDPOINT}/getNotifications`
        );
        const parsed = Array.isArray(notification) ? notification.map(n => NotificationsContract.parse(n, 'table')) : [];
        document.dispatchEvent(new CustomEvent('Notifications:list', {
            detail: parsed
        }));
        return parsed;
    },

    async create(data) {
        const notification = await postJSON(
            `${ENDPOINT}/newNotification`,
            NotificationsContract.parse(data, 'create')
        );
        const parsed = NotificationsContract.parse(notification, 'table');
        document.dispatchEvent(new CustomEvent('Notifications:create', {
            detail: parsed
        }));
        return parsed;
    },

    async update(data) {
        const notification = await putJSON(
            `${ENDPOINT}/${data.notificationID}`,
            NotificationsContract.parse(data, 'update')
        );
        const parsed = NotificationsContract.parse(notification, 'table');
        document.dispatchEvent(new CustomEvent('Notifications:update', { detail: parsed }));
        return parsed;
    },

    async delete(id) {
        const success = await deleteJSON(
            `${ENDPOINT}/deleteNotification/${id}`
        );
        document.dispatchEvent(new CustomEvent('Notifications:delete', {
            detail: {
                id,
                success
            }
        }));
        return success === true;
    }
};