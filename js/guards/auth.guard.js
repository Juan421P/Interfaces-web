// auth.guard.js
import { AuthService } from "../services/auth.service.js";

export class AuthGuard {
    static _user = null;

    static async isAuthenticated() {
        if (window.location.hash === '#login' || window.location.hash === '#not-found') {
            return false; // 👈 devolvemos explícitamente
        }
        try {
            const res = await AuthService.me();
            if (res) {
                AuthGuard._user = res;
                return true;
            }
            return false;
        } catch (err) {
            console.error('AuthGuard.isAuthenticated error:', err);
            return false;
        }
    }

    static async ensureAuth(redirectTo = '#login') {
        const ok = await AuthGuard.isAuthenticated();
        if (!ok) {
            window.location.hash = redirectTo;
            return false;
        }
        return true;
    }

    static clearUser() {
        AuthGuard._user = null;
    }

    static isAdmin() {
        return AuthGuard._user?.roleName === 'Administrador';
    }
    // ... demás roles
}
