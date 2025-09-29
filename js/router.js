import { ROUTES } from './lib/routes.js';
import { THEMES } from './lib/themes.js';
import { AuthGuard } from './guards/auth.guard.js';

import {
    Body,
    Footer,
    Toast,
    Navbar
} from './../components/components.js';

export class Router {
    constructor() {
        this.currentView = null;
        this.ALL_VIEWS = this.flattenRoutes(ROUTES.views);
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', async () => {
            await this.initializeApp();
        });

        window.addEventListener('hashchange', () => {
            THEMES.loadTheme();
            this.render();
        });
    }

    async initializeApp() {
        console.log('🚀 [Router] initializeApp started');
        console.log('🚀 [Router] Creating Body...');
        await new Body().render();
        console.log('🚀 [Router] Body completed');
        console.log('🚀 [Router] Checking DOM after Body...');
        console.log('🚀 [Router] #navbar exists:', !!document.querySelector('#navbar'));
        console.log('🚀 [Router] #main-view exists:', !!document.querySelector('#main-view'));
        console.log('🚀 [Router] #footer exists:', !!document.querySelector('#footer'));
        console.log('🚀 [Router] Body children:', Array.from(document.body.children).map(el => el.tagName + (el.id ? `#${el.id}` : '')));
        console.log('🚀 [Router] Creating Footer...');
        await new Footer().render();
        console.log('🚀 [Router] Footer completed');

        this.toast = new Toast();
        await this.toast.init();

        THEMES.loadTheme();

        const ok = await AuthGuard.isAuthenticated();
        if (!ok) {
            console.log('🚀 [Router] User not authenticated, redirecting to login');
            window.location.hash = '#login';
        } else {
            console.log('🚀 [Router] User authenticated, rendering current view');
            await this.render();
        }
    }

    flattenRoutes(obj) {
        const result = [];
        for (const val of Object.values(obj)) {
            if (val?.hash) {
                result.push(val);
            } else if (typeof val === 'object') {
                result.push(...this.flattenRoutes(val));
            }
        }
        return result;
    }

    async render(hash = window.location.hash) {
        const view = this.ALL_VIEWS.find(v => v.hash === hash);

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

        await this.handleNavbar(view);

        await this.loadInterface(view);
    }

    async handleNavbar(view) {
        if (!view.hideNavbar) {
            await new Navbar().render('#navbar');

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
    }

    async loadInterface(view) {
        try {
            const interfaceModule = await this.getInterfaceModule(view);
            const interfaceInstance = new interfaceModule.default();

            await interfaceInstance.render('#main-view');
            document.title = view.title;

        } catch (err) {
            console.error('Interface load error', err);
            window.location.hash = '#not-found';
        }
    }

    async getInterfaceModule(view) {
        const interfaceMap = {
            '#login': () => import('./../interfaces/login/login.js'),
        };

        const importFunction = interfaceMap[view.hash];
        if (!importFunction) {
            throw new Error(`No interface mapping found for hash: ${view.hash}`);
        }

        return await importFunction();
    }

    navigate(hash) {
        window.location.hash = hash;
    }

    getCurrentView() {
        return this.ALL_VIEWS.find(v => v.hash === window.location.hash);
    }
}

new Router();