import { fetchJSON, postJSON } from './../lib/network.js';
import { NotificationsContract } from './../contracts/notifications.contract.js';

const ENDPOINT = '/pjkNuT/notifications';

export const NotificationsService = {
    contract: NotificationsContract,

    async list(params) {
        return fetchJSON(ENDPOINT, params);
    },

    async create(data) {
        const payload = NotificationsContract.parse(data, 'create');
        return postJSON(ENDPOINT, payload);
    },

    async update(data) {
        const payload = NotificationsContract.parse(data, 'update');
        return postJSON(`${ENDPOINT}/${payload.id}`, payload);
    },
};
