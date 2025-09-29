import { Interface } from './../base/interface.js';
import { AuthService } from './../../js/services/auth.service.js';
import { buildInitials } from './../../js/lib/common.js';

export default class MainInterface extends Interface {

    static getTemplate() {
        return `
            <div class="hidden md:block fixed bottom-0 right-0 translate-y-[10%] translate-x-[-10%] w-[80vw] max-w-[1100px] pointer-events-none z-[-10]"></div>
            <main class="flex flex-col min-h-screen p-10 md:ml-80">
                <div class="w-full space-y-8">
                    <div class="bg-gradient-to-bl from-[rgb(var(--card-from))] to-[rgb(var(--card-to))] shadow-md rounded-xl p-6 flex items-center gap-6">
                        <div id="main-avatar"
                            class="w-14 h-14 rounded-full bg-gradient-to-tr from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] flex items-center justify-center drop-shadow flex-shrink-0">
                        </div>
                        <div class="flex-shrink-1">
                            <p id="main-welcome"
                                class="text-lg font-semibold text-transparent select-none bg-gradient-to-r from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] bg-clip-text drop-shadow">
                            </p>
                            <p id="main-role"
                                class="text-sm text-transparent select-none bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text drop-shadow">
                            </p>
                            <span id="main-date"
                                class="block mt-1 text-xs text-transparent select-none bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text drop-shadow">
                            </span>
                        </div>
                    </div>
                    <div
                        class="px-5 py-4 border border-[rgb(var(--off-from))] rounded-lg bg-gradient-to-tr from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] drop-shadow">
                        <span
                            class="bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent select-none drop-shadow">
                            Recuerda actualizar los datos de matrícula antes del <strong>8 de diciembre</strong>.
                        </span>
                    </div>
                </div>
            </main>
        `;
    }

    async init() {
        await this._loadUserData();
        this._updateDate();
    }

    async _loadUserData() {
        try {
            const user = (await AuthService.me()).user;
            const firstName = user.firstName || '';
            const lastName = user.lastName || '';
            const role = user.roleID || 'Usuario';

            const welcome = document.getElementById('main-welcome');
            if (welcome) {
                welcome.textContent = `Bienvenido, ${firstName} ${lastName}`;
            }

            const roleEl = document.getElementById('main-role');
            if (roleEl) {
                roleEl.textContent = role;
            }

            const avatarHost = document.getElementById('main-avatar');
            if (avatarHost) {
                avatarHost.innerHTML = '';
                const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase() || '?';
                avatarHost.appendChild(buildInitials(initials));
            }

        } catch (error) {
            console.error('[MainInterface] Failed to load user data:', error);

            const welcome = document.getElementById('main-welcome');
            if (welcome) welcome.textContent = 'Bienvenido';

            const roleEl = document.getElementById('main-role');
            if (roleEl) roleEl.textContent = 'Usuario';

            const avatarHost = document.getElementById('main-avatar');
            if (avatarHost) {
                avatarHost.innerHTML = '';
                avatarHost.appendChild(buildInitials('?'));
            }
        }
    }

    _updateDate() {
        const dateTarget = document.getElementById('main-date');
        if (dateTarget) {
            dateTarget.textContent = new Date().toLocaleDateString('es-SV', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        }
    }

}