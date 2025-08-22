import { ROUTES } from './lib/routes.js';
import { THEMES } from './lib/themes.js';

document.addEventListener('DOMContentLoaded', () => {
    if (!sessionStorage.getItem('userID')) {
        window.location.href = '/interfaces/login/login.html';
    }
});

const { Body } = await import(ROUTES.components.body.js);
await new Body();

const { Footer } = await import(ROUTES.components.footer.js);
await new Footer();

const { Toast } = await import(ROUTES.components.toast.js);
const toast = new Toast();
await toast.init();

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

    if (!view) { window.location.hash = '#not-found'; return; }

    if (!view.hideNavbar) {
        const { Navbar } = await import(ROUTES.components.navbar.js);
        await new Navbar().load();

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

    const html = await (await fetch(view.file)).text();
    document.querySelector('#main-view').innerHTML = html;
    document.title = view.title;

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
} else {
    THEMES.loadTheme();
    render();
}
