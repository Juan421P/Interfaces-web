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

        if (!window.location.hash) {
            window.location.hash = '#login';
        }
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
            console.log(`🚀 [Router] Loading interface for: ${view.hash}`);
            console.log(`🚀 [Router] View object:`, view);
            const interfaceModule = await this.getInterfaceModule(view);
            console.log(`🚀 [Router] Interface module loaded:`, interfaceModule);
            const interfaceInstance = new interfaceModule.default();
            console.log(`🚀 [Router] Interface instance created:`, interfaceInstance);
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
            // Interfaces generales
            '#main': () => import('./../interfaces/main/main.js'),
            '#login': () => import('./../interfaces/login/login.js'),
            '#testing': () => import('./../interfaces/testing/testing.js'),
            '#news': () => import('./../interfaces/news/news.js'),
            '#not-found': () => import('./../interfaces/not-found/not-found.js'),
            '#profile': () => import('./../interfaces/profile/profile.js'),

            // Interfaces del módulo de Sistema; Ivanya
            '#system-users': () => import('./../interfaces/system/users/users.js'),
            '#system-roles': () => import('./../interfaces/system/roles/roles.js'),
            //'#system-codes': () => import('./../interfaces/system/codes/codes.js'),
            //'#system-audit': () => import('./../interfaces/system/audit/audit.js'),

            // Interfaces del módulo de Planificación
            // Primeras 3; Ivanya
            // 159-165; Gómez
            // Últimas 5; Benjamín
            '#planification-university': () => import('./../interfaces/planification/university/university.js'),
            '#planification-localities': () => import('./../interfaces/planification/localities/localities.js'),
            '#planification-faculties': () => import('./../interfaces/planification/faculties/faculties.js'),
            '#planification-departments': () => import('./../interfaces/planification/departments/departments.js'),
            '#planification-careers': () => import('./../interfaces/planification/careers/careers.js'),
            '#planification-pensums': () => import('./../interfaces/planification/pensums/pensums.js'),
            '#planification-subjects': () => import('./../interfaces/planification/subjects/subjects.js'),
            '#planification-cycles': () => import('./../interfaces/planification/cycles/cycles.js'),
            //'#planification-dates': () => import('./../interfaces/planification/academic-dates/academic-dates.js'), ya no sirve mi w
            '#planification-modalities': () => import('./../interfaces/planification/modalities/modalities.js'),
            '#planification-degrees': () => import('./../interfaces/planification/degrees/degrees.js'),
            '#planification-titles': () => import('./../interfaces/planification/titles/titles.js'),
            '#planification-service': () => import('./../interfaces/planification/social-service/social-service.js'),
            '#planification-documents': () => import('./../interfaces/planification/documents/documents.js'),
            '#planification-evaluation-instruments': () => import('./../interfaces/planification/evaluation-instruments/evaluation-instruments.js'),

            // Interfaces del módulo de Recursos Humanos; Benjamín
            '#hr-employees': () => import('./../interfaces/human-resources/employees/employees.js'),

            // Interfaces del módulo de Registro Académico
            // La primera la hace Benjamín
            // La segunda tiene la funda y me paga para que se lo hunda
            // La tercera me quita el estrés. Polvos corridos siempre echamos tres
            // A la cuarta, de una, le bajo la luna... Pero ella quiero con Maluma y conmigo a la vez
            // Últimas 4; El novio de Gabriela Córdova
            '#ar-students': () => import('./../interfaces/academic-records/students/students.js'),
            '#ar-career-enrollments': () => import('./../interfaces/academic-records/career-enrollments/career-enrollments.js'),
            '#ar-cycle-enrollments': () => import('./../interfaces/academic-records/cycle-enrollments/cycle-enrollments.js'),
            '#ar-course-enrollments': () => import('./../interfaces/academic-records/course-enrollments/course-enrollments.js'),
            '#ar-student-performance': () => import('./../interfaces/academic-records/student-performance/student-performance.js'),

            // Interfaces del módulo de Portal de Estudiante; Juan
            //'#sp-enrollments-courses': () => import('./../interfaces/student-portal/enrollments/courses/courses.js'),
            //'#sp-enrollments-cycles': () => import('./../interfaces/student-portal/enrollments/cycles/cycles.js'),
            //'#sp-grades': () => import('./../interfaces/student-portal/grades/grades.js'),
            //'#sp-pensum': () => import('./../interfaces/student-portal/pensum/pensum.js'),
            //'#sp-evaluations': () => import('./../interfaces/student-portal/evaluations/evaluations.js'),

            // Interfaces del módulo de Portal de Docente; El novio de Gabriela Córdova
            '#tp-courses': () => import('./../interfaces/teacher-portal/courses/courses.js'),
            '#tp-evaluation-plans': () => import('./../interfaces/teacher-portal/evaluation-plans/evaluation-plans.js'),
            '#tp-evaluations': () => import('./../interfaces/teacher-portal/evaluations/evaluations.js'),
            //'#tp-schedules': () => import('./../interfaces/teacher-portal/schedules/schedules.js')
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