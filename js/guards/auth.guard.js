// auth.service.js
import { Service } from './../lib/service.js';
import { AuthContract } from './../contracts/auth.contract.js';
import { AuthGuard } from './../guards/auth.guard.js';

export class AuthService extends Service {
    static baseEndpoint = '/Auth';
    static contract = new AuthContract();

    static async login(email, password) {
        await this.postRaw('login', { email, contrasena: password }, 'login');
        // después del login pedimos el user
        const user = await this.me();
        AuthGuard._user = user;
        localStorage.setItem("user", JSON.stringify(user)); // 👈 opcional persistencia
        return true;
    }

    static async me() {
        const res = await this.get('me', null, null, 'me');
        return res;
    }

    static async logout() {
        await this.postRaw('logout');
        AuthGuard.clearUser();
        localStorage.removeItem("user");
        sessionStorage.clear();
        return true;
    }
}
