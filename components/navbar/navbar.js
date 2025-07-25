import { UsersService } from './../../js/services/users.js';
import { buildInitials, stripScripts } from './../../js/helpers/common-methods.js';
import { ROUTES } from './../../js/helpers/routes.js';

const { Modal } = await import(ROUTES.components.modal.js);

export class Navbar {
    constructor(opts = {}) {
        this.url = opts.url || './components/navbar/navbar.html';
    }

    async load() {
        const res = await fetch(this.url + '?raw');
        const htmlText = await res.text();

        const tpl = stripScripts(htmlText);

        if (tpl.content) await filterByRole(tpl.content);

        const host = document.querySelector('#navbar');
        host.innerHTML = '';
        host.append(tpl.content.cloneNode(true));

        await this.injectProfilePicture();

        this.attachCollapses();
        this.highlightActive();
        window.addEventListener('hashchange', () => this.highlightActive());
        this.attachLogoutHandler();
    }

    attachLogoutHandler() {
        const btn = document.querySelector('#logout-btn');
        if (!btn) return;

        btn.addEventListener('click', async () => {
            const modal = new Modal({ templateId: 'tmpl-logout-confirm', size: 'sm' });
            await modal.open();

            const cancel = modal.contentHost.querySelector('#logout-cancel');
            const confirm = modal.contentHost.querySelector('#logout-confirm');

            cancel?.addEventListener('click', () => modal.close());

            confirm?.addEventListener('click', () => {
                UsersService.logout();
                modal.close();
                window.location.href = '/interfaces/login/login.html';
            });
        });
    }

    async injectProfilePicture() {
        try {
            const userID = sessionStorage.getItem('userID');
            if(!userID) throw new Error('No user ID found');
            const user = await UsersService.get(userID);
            const { firstName, lastName, image: photo } = user || {};
            const initials = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();

            const avatarHost = document.querySelector('#profile-avatar');
            if (!avatarHost) return;

            avatarHost.innerHTML = '';

            if (photo) {
                const img = document.createElement('img');
                img.src = photo;
                img.className = 'h-14 w-14 rounded-full object-cover drop-shadow';
                img.onerror = () => avatarHost.appendChild(buildInitials(initials || '?'));
                avatarHost.appendChild(img);
            } else {
                avatarHost.appendChild(buildInitials(initials || '?'));
            }
        } catch (err) {
            console.error('[Navbar] user fetch failed:', err);
        }
    }

    highlightActive() {
        const hash = window.location.hash || '#main';

        document.querySelectorAll('#sidebar .nav-btn').forEach(entry => {
            entry.classList.remove(
                'bg-gradient-to-r', 'from-indigo-400', 'to-blue-400', 'shadow-lg'
            );
            entry.querySelectorAll('svg').forEach(s => s.classList.remove('text-white'));
            const sp = entry.querySelector('span');
            sp?.classList.remove('text-white');
            sp?.classList.add('text-indigo-400');

            entry.querySelector('ul')?.classList.remove(
                'bg-gradient-to-tr', 'from-indigo-50', 'to-blue-50'
            );
        });

        const activeLink = document.querySelector(`#sidebar a[href="${hash}"]`);
        const entry = activeLink?.closest('.nav-btn');
        if (!entry) return;

        entry.classList.add('bg-gradient-to-r', 'from-indigo-400', 'to-blue-400', 'shadow-lg');
        entry.querySelectorAll('svg').forEach(s => {
            s.classList.remove('text-indigo-400');
            s.classList.add('text-white');
        });

        const sp = entry.querySelector('span');
        if (sp) {
            sp.classList.remove('text-indigo-400');
            sp.classList.add('text-white');
            sp.dataset.originalLabel ??= sp.textContent;

            const label = activeLink.textContent.trim();
            if (label) sp.textContent = label;
        }

        entry.querySelector('ul')?.classList.add(
            'bg-gradient-to-tr', 'from-indigo-50', 'to-blue-50'
        );
    }


    attachCollapses() {
        document.querySelectorAll('[data-toggle="collapse"]').forEach(btn => {
            const selector = btn.dataset.target;
            const target = selector ? document.querySelector(selector) : null;
            if (!target) {
                console.warn('[Navbar] collapse target not found:', selector);
                return;
            }
            btn.addEventListener('click', () => {
                const targetIsHidden = target.classList.contains('hidden');
                target.classList.toggle('hidden');
                btn.querySelector('svg:last-child')?.classList.toggle('rotate-180');

                const span = btn.querySelector('span');
                if (!span) return;

                span.dataset.originalLabel ??= span.textContent;

                if (!targetIsHidden) {
                    const hash = window.location.hash || '#main';
                    const activeLink = target.querySelector(`a[href="${hash}"]`);
                    if (activeLink) {
                        span.textContent = activeLink.textContent.trim();
                    }
                } else {
                    span.textContent = span.dataset.originalLabel;
                }
            });
        });
    }
}

async function filterByRole(root) {
    try {
        const userID = sessionStorage.getItem('userID');
        if (!userID) throw new Error('No user ID found');

        const { role } = await UsersService.get(userID);

        const allowedMap = {
            'Administrador': ['#system-', '#planification-'],
            'RH': ['#hr-'],
            'RA': ['#ar-'],
            'Docente': ['#tp-'],
            'Estudiante': ['#sp-']
        };

        const allowedPrefixes = allowedMap[role] || [];

        root.querySelectorAll('a[href]').forEach(link => {
            const hash = link.getAttribute('href');
            const isGlobal = ['#main', '#notifications', '#not-found', '#profile', '#academic-calendar']
                .includes(hash);

            if (!isGlobal && !allowedPrefixes.some(pref => hash.startsWith(pref))) {
                link.closest('li')?.remove();
            }
        });

        root.querySelectorAll('ul').forEach(ul => {
            if (!ul.querySelector('li')) {
                ul.closest('.nav-btn')?.remove();
            }
        });
    } catch (err) {
        console.error('[Navbar] role filtering failed:', err);
    }
}