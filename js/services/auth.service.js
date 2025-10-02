import { Service } from './../lib/service.js';
import { AuthContract } from './../contracts/auth.contract.js';
import { AuthGuard } from './../guards/auth.guard.js';

export class AuthService extends Service {
    static baseEndpoint = '/Auth';
    static contract = new AuthContract();

    static async login(email, password) {
        await this.postRaw('login', { email, contrasena: password }, 'login');
        const me = await this.me();
        const user = me?.user ?? me ?? null;
        AuthGuard.user = user;
        return true;
    }

    static async me() {
        return await this.get('me', null, null, 'me');
    }

    static async logout() {
        await this.postRaw('logout');
        AuthGuard.clearUser();
        sessionStorage.clear();
        return true;
    }
}
