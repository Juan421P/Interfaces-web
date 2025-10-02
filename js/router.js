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

    async initializeApp() {
        console.log('🚀 [Router] initializeApp started');

        const isAuthenticated = await AuthGuard.isAuthenticated();
        console.log('🚀 [Router] Initial auth check:', isAuthenticated);

        console.log('🚀 [Router] Creating Body...');
        await new Body().render();
        console.log('🚀 [Router] Body completed');

        console.log('🚀 [Router] Creating Footer...');
        await new Footer().render();
        console.log('🚀 [Router] Footer completed');

        this.toast = new Toast();
        await this.toast.init();
        THEMES.loadTheme();

        const currentHash = window.location.hash;

        if (!isAuthenticated && currentHash !== '#login') {
            console.log('🚀 [Router] Not authenticated, redirecting to login');
            window.location.hash = '#login';
            return;
        }

        if (isAuthenticated && currentHash === '#login') {
            console.log('🚀 [Router] Already authenticated, redirecting to main');
            window.location.hash = '#main';
            return;
        }

        if (!currentHash || currentHash === '#') {
            window.location.hash = isAuthenticated ? '#main' : '#login';
            return;
        }

        await this.render();
    }

    async render(hash = window.location.hash) {
        const view = this.ALL_VIEWS.find(v => v.hash === hash);

        if (!view) {
            window.location.hash = '#not-found';
            return;
        }

        if (view.hash !== '#login' && view.hash !== '#not-found') {
            const isAuthenticated = await AuthGuard.isAuthenticated();
            if (!isAuthenticated) {
                window.location.hash = '#login';
                return;
            }

            if (view.guard === 'admin') {
                console.warn('Admin guard not implemented without caching');
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
            console.log(`🚀 [Router] Loading interface for: ${view.hash}`);
            const interfaceModule = await this.getInterfaceModule(view);
            const interfaceInstance = new interfaceModule.default();
            await interfaceInstance.render('#main-view');
            console.log(`🚀 [Router] Interface rendered successfully`);

            document.title = view.title;

        } catch (err) {
            console.error('Interface load error', err);
            window.location.hash = '#not-found';
        }
    }

    async getInterfaceModule(view) {
        const interfaceMap = {
            '#main': () => import('./../interfaces/main/main.js'),
            '#login': () => import('./../interfaces/login/login.js'),
            '#testing': () => import('./../interfaces/testing/testing.js'),
            '#news': () => import('./../interfaces/news/news.js'),
            '#not-found': () => import('./../interfaces/not-found/not-found.js'),
            '#profile': () => import('./../interfaces/profile/profile.js'),
            '#system-users': () => import('./../interfaces/system/users/users.js'),
            '#system-roles': () => import('./../interfaces/system/roles/roles.js'),
            '#planification-university': () => import('./../interfaces/planification/university/university.js'),
            '#planification-localities': () => import('./../interfaces/planification/localities/localities.js'),
            '#planification-faculties': () => import('./../interfaces/planification/faculties/faculties.js'),
            '#planification-departments': () => import('./../interfaces/planification/departments/departments.js'),
            '#planification-careers': () => import('./../interfaces/planification/careers/careers.js'),
            '#planification-pensums': () => import('./../interfaces/planification/pensums/pensums.js'),
            '#planification-subjects': () => import('./../interfaces/planification/subjects/subjects.js'),
            '#planification-cycles': () => import('./../interfaces/planification/cycles/cycles.js'),
            '#planification-modalities': () => import('./../interfaces/planification/modalities/modalities.js'),
            '#planification-degrees': () => import('./../interfaces/planification/degrees/degrees.js'),
            '#planification-titles': () => import('./../interfaces/planification/titles/titles.js'),
            '#planification-service': () => import('./../interfaces/planification/social-service/social-service.js'),
            '#planification-documents': () => import('./../interfaces/planification/documents/documents.js'),
            '#planification-evaluation-instruments': () => import('./../interfaces/planification/evaluation-instruments/evaluation-instruments.js'),
            '#hr-employees': () => import('./../interfaces/human-resources/employees/employees.js'),
            '#ar-students': () => import('./../interfaces/academic-records/students/students.js'),
            '#ar-career-enrollments': () => import('./../interfaces/academic-records/career-enrollments/career-enrollments.js'),
            '#ar-cycle-enrollments': () => import('./../interfaces/academic-records/cycle-enrollments/cycle-enrollments.js'),
            '#ar-course-enrollments': () => import('./../interfaces/academic-records/course-enrollments/course-enrollments.js'),
            '#ar-student-performance': () => import('./../interfaces/academic-records/student-performance/student-performance.js'),
            '#tp-courses': () => import('./../interfaces/teacher-portal/courses/courses.js'),
            '#tp-evaluation-plans': () => import('./../interfaces/teacher-portal/evaluation-plans/evaluation-plans.js'),
            '#tp-evaluations': () => import('./../interfaces/teacher-portal/evaluations/evaluations.js'),
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

    async handleLogout() {
        try {
            sessionStorage.clear();
            localStorage.clear();

            window.location.hash = '#login';

        } catch (error) {
            console.error('Logout error:', error);
            window.location.hash = '#login';
        }
    }
}

window.router = new Router();