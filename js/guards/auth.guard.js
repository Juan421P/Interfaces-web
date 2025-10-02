import { AuthService } from "../services/auth.service.js";

export class AuthGuard {
    static async isAuthenticated() {
        try {
            const res = await AuthService.me();
            return res !== null && res.user !== null;
        } catch (err) {
            console.error('AuthGuard.isAuthenticated error:', err);
            return false;
        }
    }

    static async authLogin() {
        try {
            const res = await AuthService.me();
            return res !== null && res.user !== null;
        } catch (err) {
            console.error('AuthGuard.authLogin error:', err);
            return false;
        }
    }

    static isAdmin() {
        return false;
    }

    static isStudent() {
        return false;
    }

    static isTeacher() {
        return false;
    }

    static isRA() {
        return false;
    }

    static isRH() {
        return false;
    }
}