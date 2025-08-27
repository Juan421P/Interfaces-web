import { fetchJSON, postJSON, putJSON } from './../lib/network.js';
import { NotificationsContract } from './../contracts/notifications.contract.js';

const ENDPOINT = '/pjkNuT/notifications';

export const NotificationsService = {
    contract: NotificationsContract,

    async list(params) {
        return fetchJSON(`${ENDPOINT}/getNotifications`, params);
    },

    async create(data) {
        const payload = NotificationsContract.parse(data, 'create');
        return postJSON(ENDPOINT, payload);
    },

    async update(data) {
        const payload = NotificationsContract.parse(data, 'update');
        return putJSON(`${ENDPOINT}/algo/${payload.id}`, payload);
    },
};
