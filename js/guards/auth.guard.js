import { AuthService } from "../services/auth.service.js";


const service = new AuthService();

export class AuthGuard {
    static async isAuthenticated() {
        if (window.location.hash !== '#login' && window.location.hash !== '#not-found') {
            try {
                const res = await service.me();
                return res !== null;
            } catch (err) {
                console.error('AuthGuard.isAuthenticated error:', err);
                return false;
            }
        }
    }

    static async authLogin() {
        try {
            const res = await service.me();
            return res !== null;
        } catch (err) {
            console.error('AuthGuard.authLogin error:', err);
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
