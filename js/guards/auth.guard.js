export class AuthGuard {
    static isAuthenticated() {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        if (!token) return false;

        try {
            const [, payload] = token.split('.');
            const { exp } = JSON.parse(atob(payload));
            if (exp && Date.now() >= exp * 1000) {
                return false;
            }
        } catch {
            return false;
        }

        return true;
    }

    static ensureAuth(redirectTo = '#login') {
        if (!AuthGuard.isAuthenticated()) {
            window.location.hash = redirectTo;
            return false;
        }
        return true;
    }
}