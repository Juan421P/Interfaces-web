import { AuthContract } from './../contracts/auth.contract.js';
import { fetchJSON, postJSON } from './../lib/network.js';
import { countEntries } from './../lib/common.js'

const ENDPOINT = '/Auth';

export const AuthService = {

    async login(email, password) {
        try {
            const user = await postJSON(`${ENDPOINT}/login`, AuthContract.parse({
                email, password
            }, 'login'));
            sessionStorage.setItem(
                'userID', user.id
            );
            return user;
        } catch (error) {
            console.error('Login failed :(', error);
            throw error;
        }
    },

    async logout() {
        sessionStorage.clear();
    },

};