import { UsersService } from './../../js/services/users.service.js';
import { buildInitials } from './../../js/lib/index.js';

export async function init() {
    try {
        const userID = sessionStorage.getItem('userID');
        if (!userID) throw new Error('No user ID found');
        const user = await UsersService.get(userID);
        const firstName = user.personName || null;
        const lastName = user.personLastName || null;
        const image = user.image || null;
        const role = user.rolesName || null;

        const welcome = document.getElementById('main-welcome');
        if (welcome) welcome.textContent = `Bienvenido, ${firstName} ${lastName}`;

        const roleEl = document.getElementById('main-role');
        if (roleEl) roleEl.textContent = role;

        const avatarHost = document.getElementById('main-avatar');
        if (avatarHost) {
            avatarHost.innerHTML = '';
            if (image) {
                const img = document.createElement('img');
                img.src = image;
                img.alt = `${firstName} ${lastName}`;
                img.className = 'object-cover rounded-full h-14 w-14 drop-shadow';
                img.onerror = () => {
                    avatarHost.innerHTML = '';
                    avatarHost.appendChild(
                        buildInitials(`${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase() || '?')
                    );
                };
                avatarHost.appendChild(img);
            } else {
                avatarHost.appendChild(
                    buildInitials(`${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase() || '?')
                );
            }
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
