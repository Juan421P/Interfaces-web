import { NotificationsContract } from './../contracts/notifications.contract.js';
import { Network } from './../lib/network.js';

const ENDPOINT = '/Notifications';
const contract = new NotificationsContract();

export const NotificationsService = {

    async list() {
        const notification = await Network.get({
            path: `${ENDPOINT}/getNotifications`,
            includeCredentials: true
        });
        const parsed = Array.isArray(notification) ? notification.map(n => contract.parse(n, 'table')) : [];
        document.dispatchEvent(new CustomEvent('Notifications:list', {
            detail: parsed
        }));
        return parsed;
    },

    async create(data) {
        const notification = await Network.post({
            path: `${ENDPOINT}/newNotification`,
            body: contract.parse(data, 'create'),
            includeCredentials: true
        });
        const parsed = contract.parse(notification, 'table');
        document.dispatchEvent(new CustomEvent('Notifications:create', {
            detail: parsed
        }));
        return parsed;
    },

    async update(data) {
        const notification = await Network.put({
            path: `${ENDPOINT}/updateNotification/${data.notificationID}`,
            body: contract.parse(data, 'update'),
            includeCredentials: true
        });
        const parsed = contract.parse(notification, 'table');
        document.dispatchEvent(new CustomEvent('Notifications:update', {
            detail: parsed
        }));
        return parsed;
    },

    async delete(id) {
        const res = await Network.delete({
            path: `${ENDPOINT}/deleteNotification/${id}`,
            includeCredentials: true
        });
        const success = res?.status === 'Proceso completado';
        document.dispatchEvent(new CustomEvent('Notifications:delete', {
            detail: {
                id,
                success,
                res
            }
        }));
        return ok;
    },

};