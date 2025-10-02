import { AuthService } from "../services/auth.service.js";

export class AuthGuard {
    static _user = null;

    // Verifica si hay sesión activa
    static async isAuthenticated() {
        if (window.location.hash === '#login' || window.location.hash === '#not-found') {
            return false; // 🔑 devolvemos explícito
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

    // Forzar validación de login
    static async authLogin() {
        try {
            const res = await AuthService.me();
            if (res) {
                AuthGuard._user = res;
                return true;
            }
            return false;
        } catch (err) {
            console.error('AuthGuard.authLogin error:', err);
            return false;
        }
    }

    // Si no está autenticado -> redirigir
    static async ensureAuth(redirectTo = '#login') {
        const ok = await AuthGuard.isAuthenticated();
        if (!ok) {
            window.location.hash = redirectTo;
            return false;
        }
        return true;
    }

    // Limpiar usuario al cerrar sesión
    static clearUser() {
        AuthGuard._user = null;
    }

    // =====================
    // 📌 Roles por nombre
    // =====================
    static isAdmin() {
        return AuthGuard._user?.roleName === "Administrador";
    }

    static isRA() {
        return AuthGuard._user?.roleName === "Registro Académico";
    }

    static isRH() {
        return AuthGuard._user?.roleName === "Recursos Humanos";
    }

    static isTeacher() {
        return AuthGuard._user?.roleName === "Docente";
    }

    static isStudent() {
        return AuthGuard._user?.roleName === "Estudiante";
    }
}
