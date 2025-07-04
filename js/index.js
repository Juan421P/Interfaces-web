import { ROUTES } from './helpers/routes.js';

const { Body } = await import(ROUTES.components.body.js);
await new Body().load();

await (await import(ROUTES.components.footer.js)).Footer.prototype.load?.call(new (await import(ROUTES.components.footer.js)).Footer());

const { Toast } = await import(ROUTES.components.toast.js);
const toast = new Toast();
await toast.init();

async function render(hash = window.location.hash || '#main') {
    const view = Object.values(ROUTES.views).find(v => v.hash === hash);

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
}

window.addEventListener('hashchange', () => render());

if (!window.location.hash) {
    window.location.hash = '#main';
} else {
    render();
}
