import { ROUTES } from './lib/routes.js';
import { THEMES } from './lib/themes.js';
import { AuthGuard } from './guards/auth.guard.js';

document.addEventListener('DOMContentLoaded', async () => {
    const { Body } = await import(ROUTES.components.layout.body.js);
    await new Body();

    const { Footer } = await import(ROUTES.components.layout.footer.js);
    await new Footer();

    const { Toast } = await import(ROUTES.components.overlay.toast.js);
    const toast = new Toast();
    await toast.init();

    const ok = await AuthGuard.isAuthenticated();
    if(!ok){
        window.location.hash = '#login';
    }

    THEMES.loadTheme();
    render();
});

function flattenRoutes(obj) {
    const result = [];
    for (const val of Object.values(obj)) {
        if (val?.hash) {
            result.push(val);
        } else if (typeof val === 'object') {
            result.push(...flattenRoutes(val));
        }
    }
    return result;
}

const ALL_VIEWS = flattenRoutes(ROUTES.views);

async function render(hash = window.location.hash || '#main') {
    const view = ALL_VIEWS.find(v => v.hash === hash);

    if (!view) {
        window.location.hash = '#not-found';
        return;
    }

    if (view.hash !== '#login' && view.hash !== '#not-found') {
        const ok = await AuthGuard.isAuthenticated();
        if (!ok) {
            window.location.hash = '#login';
            return;
        }

        if (view.guard === 'admin' && !AuthGuard.isAdmin()) {
            window.location.hash = '#main';
            return;
        }
    }


    if (!view.hideNavbar) {
        const { Navbar } = await import(ROUTES.components.layout.navbar.js);
        await new Navbar();

        const burger = document.querySelector('#burger-btn');
        const wrapper = document.querySelector('#sidebar-wrapper');
        if (burger && wrapper) {
            burger.addEventListener('click', () => {
                wrapper.classList.toggle('-translate-x-full');
            });
        }
    } else {
        const host = document.querySelector('#navbar');
        if (host) host.innerHTML = '';
    }

    try {
        const res = await fetch(view.file);
        if (!res.ok) {
            console.error(`Failed to load ${view.file}`, res.status);
            window.location.hash = '#not-found';
            return;
        }
        const html = await res.text();
        document.querySelector('#main-view').innerHTML = html;
        document.title = view.title;
    } catch (err) {
        console.error('View fetch error', err);
        window.location.hash = '#not-found';
        return;
    }

    try {
        const jsPath = view.file.replace(/\.html$/, '.js');
        const mod = await import(new URL(jsPath, import.meta.url).href);
        if (mod.init) await mod.init();
    } catch (error) {
        console.warn('No logic found for', hash, error);
    }
}

window.addEventListener('hashchange', () => {
    THEMES.loadTheme();
    render();
});

if (!window.location.hash) {
    window.location.hash = '#main';
}