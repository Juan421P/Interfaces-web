import { AuthService } from "../services/auth.service.js";

export class AuthGuard {
    static _cachedUser = null;
    static _lastCheck = 0;
    static CACHE_DURATION = 30000;

    static async isAuthenticated(forceRefresh = false) {
        if (!forceRefresh && this._cachedUser && Date.now() - this._lastCheck < this.CACHE_DURATION) {
            return true;
        }

        try {
            const res = await AuthService.me();
            this._cachedUser = res;
            this._lastCheck = Date.now();
            return res !== null;
        } catch (err) {
            console.error('AuthGuard.isAuthenticated error:', err);
            this._cachedUser = null;
            return false;
        }
    }

    static async authLogin() {
        try {
            const res = await AuthService.me();
            this._cachedUser = res;
            this._lastCheck = Date.now();
            return res !== null;
        } catch (err) {
            console.error('AuthGuard.authLogin error:', err);
            this._cachedUser = null;
            return false;
        }
    }

    static clearCache() {
        this._cachedUser = null;
        this._lastCheck = 0;
    }

    static get user() {
        return this._cachedUser;
    }

    static async ensureAuth(redirectTo = '#login') {
        const ok = await AuthGuard.isAuthenticated();
        if (!ok) {
            window.location.hash = redirectTo;
            return false;
        }
        return true;
    }

    static isAdmin() {
        return AuthGuard._user?.roleName === 'Administrador';
    }

    static isStudent() {
        return AuthGuard._user?.roleName === 'Estudiante';
    }

    static isTeacher() {
        return AuthGuard._user?.roleName === 'Docente';
    }

    static isRA() {
        return AuthGuard._user?.roleName === 'Registro Académico';
    }

    static isRH() {
        return AuthGuard._user?.roleName === 'Recursos Humanos';
    }
}
