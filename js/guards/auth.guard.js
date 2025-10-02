import { AuthService } from "../services/auth.service.js";

export class AuthGuard {
    static _user = null;

    static get user() {
        if (this._user) return this._user;
        try {
            this._user = JSON.parse(localStorage.getItem("user") || "null");
        } catch { this._user = null; }
        return this._user;
    }

    static set user(val) {
        this._user = val;
        if (val) localStorage.setItem("user", JSON.stringify(val));
        else localStorage.removeItem("user");
    }

    static async isAuthenticated() {
        if (window.location.hash === '#login' || window.location.hash === '#not-found') return false;
        try {
            const res = await AuthService.me();
            const user = res?.user ?? res ?? null;
            if (user) {
                AuthGuard.user = user;
                return true;
            }
            return false;
        } catch (err) {
            console.error('AuthGuard.isAuthenticated error:', err);
            return false;
        }
    }

    static async authLogin() {
        try {
            const res = await AuthService.me();
            const user = res?.user ?? res ?? null;
            if (user) { AuthGuard.user = user; return true; }
            return false;
        } catch (err) {
            console.error('AuthGuard.authLogin error:', err);
            return false;
        }
    }

    static async ensureAuth(redirectTo = '#login') {
        const ok = await AuthGuard.isAuthenticated();
        if (!ok) { window.location.hash = redirectTo; return false; }
        return true;
    }

    static clearUser() { AuthGuard.user = null; }

    static isAdmin() { return AuthGuard.user?.roleName === "Administrador"; }
    static isRA() { return AuthGuard.user?.roleName === "Registro Académico"; }
    static isRH() { return AuthGuard.user?.roleName === "Recursos Humanos"; }
    static isTeacher() { return AuthGuard.user?.roleName === "Docente"; }
    static isStudent() { return AuthGuard.user?.roleName === "Estudiante"; }
}
