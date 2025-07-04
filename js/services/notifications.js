import { fetchJSON } from "../helpers/network";
const ENDPOINT = '/pjkNuT/notifications';
export const NotificationsService = {
    list(){
        return fetchJSON(ENDPOINT);
    }
};