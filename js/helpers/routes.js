export const ROUTES = {

    interfaces: {
        login: {
            path: '/interfaces/login/login.html',
            title: 'Inicio de sesión'
        },
        app: {
            path: '/index.html',
            title: 'Aplicación'
        }
    },

    /* ----------------------------- VISTAS ----------------------------- */
    views: {

        /* ----------------------------- 1. GLOBALES ----------------------------- */
        main: {
            hash: '#main',
            file: '/interfaces/main/main.html',
            title: 'Inicio'
        },
        notifications: {
            hash: '#notifications',
            file: '/interfaces/notifications/notifications.html',
            title: 'Notificaciones'
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
        academicCalendar: {
            hash: '#academic-calendar',
            file: '/interfaces/academic/academic-calendar/academic-calendar.html',
            title: 'Calendario Académico'
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
            pensum: {
                hash: '#planification-pensum',
                file: '/interfaces/planification/pensum/pensum.html',
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

        /* ----------------------- 3. ADMINISTRADOR RH -------------------------- */
        humanResources: {
            employees: {
                hash: '#hr-employees',
                file: '/interfaces/human-resources/employees/employees.html',
                title: 'Gestión de empleados'
            }
        },

        /* ----------------------- 4. ADMINISTRADOR RA -------------------------- */
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
                title: 'Inscripción a materias'
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
        body: {
            html: '/components/body/body.html',
            js: '/components/body/body.js'
        },
        calendar: {
            html: '/components/calendar/calendar.html',
            js: '/components/calendar/calendar.js'
        },
        contextMenu: {
            html: '/components/context-menu/context-menu.html',
            js: '/components/context-menu/context-menu.js'
        },
        footer: {
            html: '/components/footer/footer.html',
            js: '/components/footer/footer.js'
        },
        modal: {
            html: '/components/modal/modal.html',
            js: '/components/modal/modal.js'
        },
        navbar: {
            html: '/components/navbar/navbar.html',
            js: '/components/navbar/navbar.js'
        },
        notification: {
            html: '/components/notification/notification.html',
            js: '/components/notification/notification.js'
        },
        table: {
            html: '/components/table/table.html',
            js: '/components/table/table.js'
        },
        toast: {
            html: '/components/toast/toast.html',
            js: '/components/toast/toast.js'
        }
    }
};
