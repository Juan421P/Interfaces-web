import { buildInitials } from './../../js/lib/common.js';
import { AuthService } from '../../js/services/auth.service.js';

export async function init() {
    try {
        const user = (await AuthService.me()).user;
        const firstName = user.firstName || null;
        const lastName = user.lastName || null;
        const role = user.roleID || null;

        const welcome = document.getElementById('main-welcome');
        if (welcome) welcome.textContent = `Bienvenido, ${firstName} ${lastName}`;

        const roleEl = document.getElementById('main-role');
        if (roleEl) roleEl.textContent = role;

        const avatarHost = document.getElementById('main-avatar');
        if (avatarHost) {
            avatarHost.innerHTML = '';
            avatarHost.appendChild(
                buildInitials(`${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase() || '?')
            );
        }
    } catch (error) {
        console.error('[main] failed to load user data:', error);
    }

    const dateTarget = document.getElementById('main-date');
    if (dateTarget) {
        dateTarget.textContent = new Date().toLocaleDateString('es-SV', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        });
    }
}
