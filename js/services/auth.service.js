import { AuthContract } from './../contracts/auth.contract.js';
import { Network } from './../lib/network.js';

const ENDPOINT = '/auth';
const contract = new AuthContract();

export const AuthService = {

    async login(email, password) {
        const payload = contract.parse({
            email,
            password
        }, 'login');

        return (await Network.post({
            path: `${ENDPOINT}/login`,
            body: payload,
            includeCredentials: true
        })) == 'Inicio de sesión exitoso';
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