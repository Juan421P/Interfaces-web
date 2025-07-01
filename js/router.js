import { ROUTES } from './helpers/routes.js';
import { Body } from '../components/body/body.js';
import { Footer } from '../components/footer/footer.js';

const body = new Body({
    afterLoad() {
        new Footer().load();
        navigate();
        window.addEventListener('hashchange', navigate());
    }
});
body.load();

async function navigate() {
    const routeKey = Object.keys(ROUTES.views).find(
        key => ROUTES.views[key].hash === location.hash
    ) || 'main';
    const { file } = ROUTES.views[routeKey];
    try {
        const html = await fetch(file).then(r => r.text());
        document.querySelector('#main').innerHTML = html;
        try {
            const module = await import(`./pages/${routeKey}.js`)
            if (module && module.init) module.init();
        } catch (_) { }
    } catch (error) {
        console.error('View failed to load :(', error);
        document.querySelector('#main').innerHTML = '<p class="p-6 text-red-400">Error al cargar la página 😥</p>';
    }
}