import { Service } from './../lib/service.js';
import { AuthContract } from './../contracts/auth.contract.js';

export class AuthService extends Service {
    constructor() {
        super('/Auth', new AuthContract());
    }

    async login(email, contrasena) {
        const payload = { email, contrasena };
        await this.create(payload, 'login', 'login');
    }

    async me() {
        return await this.get('me', 'me', 'table');
    }

    async logout() {
        await this.create({}, 'logout', 'logout');
    }
}