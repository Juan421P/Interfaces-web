import { AuthService } from "../services/auth.service.js";

export class AuthGuard {
    static _cachedUser = null;
    static _lastCheck = 0;
    static CACHE_DURATION = 30000;

    static async isAuthenticated(forceRefresh = false) {
        if (forceRefresh || Date.now() - this._lastCheck > this.CACHE_DURATION) {
            this._cachedUser = null;
        }

        if (this._cachedUser !== null) {
            return true;
        }

        try {
            const res = await AuthService.me();
            if (res && res.user) {
                this._cachedUser = res.user;
                this._lastCheck = Date.now();
                return true;
            } else {
                this._cachedUser = null;
                return false;
            }
        } catch (err) {
            console.error('AuthGuard.isAuthenticated error:', err);
            this._cachedUser = null;
            return false;
        }
    }

    static async authLogin() {
        this._cachedUser = null;
        return await this.isAuthenticated(true);
    }

    static get user() {
        return this._cachedUser;
    }

    static clearCache() {
        this._cachedUser = null;
        this._lastCheck = 0;
    }

    static isAdmin() {
        return this._cachedUser?.roleID === 'Administrador';
    }

    static isStudent() {
        return this._cachedUser?.roleID === 'Estudiante';
    }

    static isTeacher() {
        return this._cachedUser?.roleID === 'Docente';
    }

    static isRA() {
        return this._cachedUser?.roleID === 'Registro Académico';
    }

    static isRH() {
        return this._cachedUser?.roleID === 'Recursos Humanos';
    }
}