import { Service } from './../lib/service.js';
import { AuthContract } from './../contracts/auth.contract.js';
import { AuthGuard } from './../guards/auth.guard.js';

export class AuthService extends Service {
    static baseEndpoint = '/Auth';
    static contract = new AuthContract();

    static async login(email, password) {
        return await this.postRaw('login', {
            email: email,
            contrasena: password
        }, 'login');
    }

    static async me() {
        return await this.get('me', null, null, 'me');
    }

    static async logout() {
        return await this.postRaw('logout');
    }
}
