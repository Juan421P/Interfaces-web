import { fetchJSON } from './../helpers/network';
import { postJSON } from './../helpers/network';

const ENDPOINT = '/pjkNuT/notifications';

export const NotificationsService = {
    async list(){
        return fetchJSON(ENDPOINT);
    },

    async create(data){
        const response = await postJSON(ENDPOINT, data);
        return response;
    }
};