export const ROUTES = {

    /* ----------------------------- VISTAS ----------------------------- */
    views: {

        /* ----------------------------- 1. GLOBALES ----------------------------- */
        main: {
            hash: '#main',
            file: '/interfaces/main/main.html',
            title: 'Inicio'
        },
        login: {
            hash: '#login',
            file: '/interfaces/login/login.html',
            title: 'Inicio de sesión',
            hideNavbar: true
        },
        testing: {
            hash: '#testing',
            file: '/interfaces/testing/testing.html',
            title: 'Zona de pruebas'
        },
        news: {
            hash: '#news',
            file: '/interfaces/news/news.html',
            title: 'Noticias'
        },
        notFound: {
            hash: '#not-found',
            file: '/interfaces/not-found/not-found.html',
            title: 'Página no encontrada',
            hideNavbar: true
        },
        profile: {
            hash: '#profile',
            file: '/interfaces/profile/profile.html',
            title: 'Perfil'
        },

        /* --------------------------- 2. ADMINISTRADOR -------------------------- */
        system: {
            users: {
                hash: '#system-users',
                file: '/interfaces/system/users/users.html',
                title: 'Usuarios'
            },
            roles: {
                hash: '#system-roles',
                file: '/interfaces/system/roles/roles.html',
                title: 'Roles'
            },
            codes: {
                hash: '#system-codes',
                file: '/interfaces/system/codes/codes.html',
                title: 'Códigos'
            },
            audit: {
                hash: '#system-audit',
                file: '/interfaces/system/audit/audit.html',
                title: 'Auditoría'
            }
        },

        planification: {
            university: {
                hash: '#planification-university',
                file: '/interfaces/planification/university/university.html',
                title: 'Universidad'
            },
            localities: {
                hash: '#planification-localities',
                file: '/interfaces/planification/localities/localities.html',
                title: 'Localidades'
            },
            faculties: {
                hash: '#planification-faculties',
                file: '/interfaces/planification/faculties/faculties.html',
                title: 'Facultades'
            },
            departments: {
                hash: '#planification-departments',
                file: '/interfaces/planification/departments/departments.html',
                title: 'Departamentos'
            },
            careers: {
                hash: '#planification-careers',
                file: '/interfaces/planification/careers/careers.html',
                title: 'Carreras'
            },
            pensums: {
                hash: '#planification-pensums',
                file: '/interfaces/planification/pensums/pensums.html',
                title: 'Pensums'
            },
            subjects: {
                hash: '#planification-subjects',
                file: '/interfaces/planification/subjects/subjects.html',
                title: 'Materias' // subjectFamilies + subjectDefinitions + requirements + requirementConditions
            },
            cycles: {
                hash: '#planification-cycles',
                file: '/interfaces/planification/cycles/cycles.html',
                title: 'Ciclos Académicos' // academicYears + cycleTypes + yearCycles
            },
            dates: {
                hash: '#planification-dates',
                file: '/interfaces/planification/academic-dates/academic-dates.html',
                title: 'Fechas Académicas'
            },
            modalities: {
                hash: '#planification-modalities',
                file: '/interfaces/planification/modalities/modalities.html',
                title: 'Modalidades'
            },
            degrees: {
                hash: '#planification-degrees',
                file: '/interfaces/planification/degrees/degrees.html',
                title: 'Grados Académicos' // CRUD de academicLevels
            },
            titles: {
                hash: '#planification-titles',
                file: '/interfaces/planification/titles/titles.html',
                title: 'Títulos Académicos' // CRUD de degreeTypes
            },
            service: {
                hash: '#planification-service',
                file: '/interfaces/planification/social-service/social-service.html',
                title: 'Servicio Social'
            },
            documents: {
                hash: '#planification-documents',
                file: '/interfaces/planification/documents/documents.html',
                title: 'Documentos' // CRUD de documentCategories
            },
            evaluationInstruments: {
                hash: '#planification-evaluation-instruments',
                file: '/interfaces/planification/evaluation-instruments/evaluation-instruments.html',
                title: 'Instrumentos de Evaluación'
            }
        },

        /* ----------------------- 3. RH -------------------------- */
        humanResources: {
            employees: {
                hash: '#hr-employees',
                file: '/interfaces/human-resources/employees/employees.html',
                title: 'Gestión de empleados'
            }
        },

        /* ----------------------- 4. RA -------------------------- */
        academicRecords: {
            students: {
                hash: '#ar-students',
                file: '/interfaces/academic-records/students/students.html',
                title: 'Gestión de estudiantes'
            },
            careerEnrollments: {
                hash: '#ar-career-enrollments',
                file: '/interfaces/academic-records/career-enrollments/career-enrollments.html',
                title: 'Inscripción a carreras'
            },
            cycleEnrollments: {
                hash: '#ar-cycle-enrollments',
                file: '/interfaces/academic-records/cycle-enrollments/cycle-enrollments.html',
                title: 'Inscripción a ciclos'
            },
            courseEnrollments: {
                hash: '#ar-course-enrollments',
                file: '/interfaces/academic-records/course-enrollments/course-enrollments.html',
                title: 'Inscripción a clases'
            },
            studentPerformance: {
                hash: '#ar-student-performance',
                file: '/interfaces/academic-records/student-performance/student-performance.html',
                title: 'Desempeño de estudiantes'
            }
        },

        /* ---------------------------- 5. ESTUDIANTE ---------------------------- */
        studentPortal: {
            enrollmentsCourses: {
                hash: '#sp-enrollments-courses',
                file: '/interfaces/student-portal/enrollments/courses/courses.html',
                title: 'Inscripción de materias'
            },
            enrollmentsCycles: {
                hash: '#sp-enrollments-cycles',
                file: '/interfaces/student-portal/enrollments/cycles/cycles.html',
                title: 'Inscripción a ciclos'
            },
            grades: {
                hash: '#sp-grades',
                file: '/interfaces/student-portal/grades/grades.html',
                title: 'Notas parciales'
            },
            pensum: {
                hash: '#sp-pensum',
                file: '/interfaces/student-portal/pensum/pensum.html',
                title: 'Pensum'
            },
            evaluations: {
                hash: '#sp-evaluations',
                file: '/interfaces/student-portal/evaluations/evaluations.html',
                title: 'Evaluaciones'
            }
        },

        /* ------------------------------ 6. DOCENTE ----------------------------- */
        teacherPortal: {
            courses: {
                hash: '#tp-courses',
                file: '/interfaces/teacher-portal/courses/courses.html',
                title: 'Materias'
            },
            evaluationPlans: {
                hash: '#tp-evaluation-plans',
                file: '/interfaces/teacher-portal/evaluation-plans/evaluation-plans.html',
                title: 'Planes de evaluación'
            },
            evaluations: {
                hash: '#tp-evaluations',
                file: '/interfaces/teacher-portal/evaluations/evaluations.html',
                title: 'Ingreso de notas'
            },
            schedules: {
                hash: '#tp-schedules',
                file: '/interfaces/teacher-portal/schedules/schedules.html',
                title: 'Horarios'
            }
        }
    },

    /* ---------------------------- COMPONENTES ---------------------------- */
    components: {
        basic: {
            button: {
                html: '/components/basic/button/button.html',
                js: '/components/basic/button/button.js'
            },
            calendar: {
                html: '/components/basic/calendar/calendar.html',
                js: '/components/basic/calendar/calendar.js'
            },
            checkbox: {
                html: '/components/basic/checkbox/checkbox.html',
                js: '/components/basic/checkbox/checkbox.js'
            },
            tabBar: {
                html: '/components/basic/tab-bar/tab-bar.html',
                js: '/components/basic/tab-bar/tab-bar.js'
            }
        },
        container: {
            form: {
                html: '/components/container/form/form.html',
                js: '/components/container/form/form.js'
            },
        },
        display: {
            cardContainer: {
                html: '/components/display/card-container/card-container.html',
                js: '/components/display/card-container/card-container.js'
            },
            table: {
                html: '/components/display/table/table.html',
                js: '/components/display/table/table.js'
            },
        },
        form: {
            formInput: {
                html: '/components/form/form-input/form-input.html',
                js: '/components/form/form-input/form-input.js'
            },
            searchInput: {
                html: '/components/form/search-input/search-input.html',
                js: '/components/form/search-input/search-input.js'
            },
            select: {
                html: '/components/form/select/select.html',
                js: '/components/form/select/select.js'
            },
            submitInput: {
                html: '/components/form/submit-input/submit-input.html',
                js: '/components/form/submit-input/submit-input.js'
            },
        },
        layout: {
            body: {
                html: '/components/layout/body/body.html',
                js: '/components/layout/body/body.js'
            },
            footer: {
                html: '/components/layout/footer/footer.html',
                js: '/components/layout/footer/footer.js'
            },
            navbar: {
                html: '/components/layout/navbar/navbar.html',
                js: '/components/layout/navbar/navbar.js'
            },
        },
        overlay: {
            contextMenu: {
                html: '/components/overlay/context-menu/context-menu.html',
                js: '/components/overlay/context-menu/context-menu.js'
            },
            modal: {
                html: '/components/overlay/modal/modal.html',
                js: '/components/overlay/modal/modal.js'
            },
            toast: {
                html: '/components/overlay/toast/toast.html',
                js: '/components/overlay/toast/toast.js'
            },
        }
    }
};
