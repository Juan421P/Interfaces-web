import { fetchJSON } from '../lib/network';

const ENDPOINT = '/Users';

export const UsersService = {
    async list() {
        return fetchJSON(`${ENDPOINT}/get`);
    },

    async get(id){
        const user = await fetchJSON(`${ENDPOINT}/findUsersById/${id}`);
        return user;
    }
    
};