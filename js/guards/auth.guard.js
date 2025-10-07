import { AuthService } from "../services/auth.service.js";

export class AuthGuard {
    static _user = null;
    static _lastAuthCheck = null;
    static AUTH_CACHE_TTL = 5 * 60 * 1000;
    static ROLE_NAMES = {
        ADMIN: "Administrador",
        ACADEMIC_RECORDS: "Registro Académico",
        HUMAN_RESOURCES: "Recursos Humanos",
        TEACHER: "Docente",
        STUDENT: "Estudiante"
    };

    static get user() {
        if (this._user) return this._user;

        try {
            const stored = localStorage.getItem("user");
            this._user = stored ? JSON.parse(stored) : null;

            const lastCheck = localStorage.getItem("auth_last_check");
            this._lastAuthCheck = lastCheck ? parseInt(lastCheck) : null;

        } catch (error) {
            console.warn("[AuthGuard] Failed to parse stored user data:", error);
            this._clearStoredData();
        }

        return this._user;
    }

    static set user(user) {
        this._user = user;
        this._lastAuthCheck = Date.now();

        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("auth_last_check", this._lastAuthCheck.toString());
        } else {
            this._clearStoredData();
        }
    }

    static clearStoredData(){
        this._clearStoredData();
    }

    static _clearStoredData() {
        this._user = null;
        this._lastAuthCheck = null;
        localStorage.removeItem("user");
        localStorage.removeItem("auth_last_check");
    }

    static async isAuthenticated(forceRefresh = false) {
        if (this._isPublicRoute()) return false;

        if (!forceRefresh && this._hasValidCache()) {
            return !!this.user;
        }

        try {
            const user = await this._fetchCurrentUser();

            if (user) {
                this.user = user;
                return true;
            }

            this._clearStoredData();
            return false;

        } catch (error) {
            console.error("[AuthGuard] Authentication check failed:", error);

            if (this._hasValidCache() && this._isCacheRecent()) {
                console.warn("[AuthGuard] Using cached auth due to network error");
                return true;
            }

            this._clearStoredData();
            return false;
        }
    }

    static shouldRefreshAuth() {
        return !this._lastAuthCheck ||
            (Date.now() - this._lastAuthCheck) > this.AUTH_CACHE_TTL;
    }

    static async ensureAuth(redirectTo = '#login') {
        const isAuthenticated = await this.isAuthenticated();

        if (!isAuthenticated) {
            console.warn("[AuthGuard] Authentication required, redirecting to:", redirectTo);
            window.location.hash = redirectTo;
            return false;
        }

        return true;
    }

    static hasRole(roleName) {
        return this.user?.roleName === roleName;
    }

    static hasAnyRole(roleNames) {
        return roleNames.some(role => this.hasRole(role));
    }

    static hasAllRoles(roleNames) {
        return roleNames.every(role => this.hasRole(role));
    }

    static isAdmin() {
        return this.hasRole(this.ROLE_NAMES.ADMIN);
    }

    static isRA() {
        return this.hasRole(this.ROLE_NAMES.ACADEMIC_RECORDS);
    }

    static isRH() {
        return this.hasRole(this.ROLE_NAMES.HUMAN_RESOURCES);
    }

    static isTeacher() {
        return this.hasRole(this.ROLE_NAMES.TEACHER);
    }

    static isStudent() {
        return this.hasRole(this.ROLE_NAMES.STUDENT);
    }

    static canAccessAdmin() {
        return this.hasAnyRole([
            this.ROLE_NAMES.ADMIN
        ]);
    }

    static canAccessAcademicRecords() {
        return this.hasAnyRole([
            // this.ROLE_NAMES.ADMIN,
            this.ROLE_NAMES.ACADEMIC_RECORDS
        ]);
    }

    static canAccessTeacherPortal() {
        return this.hasAnyRole([
            // this.ROLE_NAMES.ADMIN,
            this.ROLE_NAMES.TEACHER
        ]);
    }

    static async refreshAuth() {
        try {
            const user = await this._fetchCurrentUser();

            if (user) {
                this.user = user;
                return true;
            }

            this._clearStoredData();
            return false;

        } catch (error) {
            console.error("[AuthGuard] Auth refresh failed:", error);

            if (!this._isCacheRecent()) {
                this._clearStoredData();
            }

            return false;
        }
    }

    static async login(credentials) {
        try {
            const result = await AuthService.login(credentials);
            const user = result?.user ?? result;

            if (user) {
                this.user = user;
                return { success: true, user };
            }

            return { success: false, error: "Invalid login response" };

        } catch (error) {
            console.error("[AuthGuard] Login failed:", error);
            return {
                success: false,
                error: error.message || "Login failed"
            };
        }
    }

    static async logout() {
        try {
            await AuthService.logout();
        } catch (error) {
            console.warn("[AuthGuard] Logout API call failed:", error);
        } finally {
            this._clearStoredData();
            console.log("[AuthGuard] User logged out");
        }
    }

    static getAuthState() {
        return {
            isAuthenticated: !!this.user,
            user: this.user,
            lastChecked: this._lastAuthCheck,
            cacheValid: this._hasValidCache(),
            roles: {
                isAdmin: this.isAdmin(),
                isRA: this.isRA(),
                isRH: this.isRH(),
                isTeacher: this.isTeacher(),
                isStudent: this.isStudent()
            }
        };
    }

    static _isPublicRoute() {
        const publicRoutes = ['#login', '#not-found', '#'];
        return publicRoutes.includes(window.location.hash);
    }

    static _hasValidCache() {
        return !!this.user && !!this._lastAuthCheck;
    }

    static _isCacheRecent() {
        return this._lastAuthCheck &&
            (Date.now() - this._lastAuthCheck) < (this.AUTH_CACHE_TTL * 2);
    }

    static async _fetchCurrentUser() {
        const response = await AuthService.me();
        return response?.user ?? response ?? null;
    }

    static _debug() {
        return {
            user: this.user,
            lastAuthCheck: this._lastAuthCheck,
            cacheAge: this._lastAuthCheck ? Date.now() - this._lastAuthCheck : null,
            shouldRefresh: this.shouldRefreshAuth(),
            authState: this.getAuthState()
        };
    }
}