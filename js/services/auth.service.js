import { AuthContract } from './../contracts/auth.contract.js';
import { Network } from './../lib/network.js';

const ENDPOINT = '/Auth';
const contract = new AuthContract();

export const AuthService = {

    async login(email, contrasena) {
        const payload = contract.parse({
            email,
            contrasena
        }, 'login');

        await Network.post({
            path: `${ENDPOINT}/login`,
            body: payload,
            includeCredentials: true
        });

        return;
    },

    async me() {
        return await Network.get({
            path: `${ENDPOINT}/me`,
            includeCredentials: true
        });
    },

    async logout() {
        return await Network.post({
            path: `${ENDPOINT}/logout`,
            includeCredentials: true
        });
    }

};