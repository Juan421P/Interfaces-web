export const ROUTES = {

    interfaces: {

        login: {
            path: '/interfaces/login/login.html',
            title: 'Inicio de sesión'
        },

        app: {
            path: '/index.html',
            title: 'Aplicación'
        },

    },

    views: {

        main: {
            hash: '#main',
            file: '/interfaces/main/main.html',
            title: 'Inicio'
        },

        students: {
            hash: '#students',
            file: '/interfaces/students/students.html',
            title: 'Estudiantes'
        },

        notFound: {
            hash: '#not-found',
            file: '/interfaces/not-found/not-found.html',
            title: 'Página no encontrada',
            hideNavbar: true
        },

        notifications: {
            hash: '#notifications',
            file: '/interfaces/notifications/notifications.html',
            title: 'Notificaciones'
        },

        planification: {

            academicDates: {
                hash: '#planification-dates',
                file: '/interfaces/planification/academic-dates/academic-dates.html',
                title: 'Fechas Académicas'
            },
            
            careers: {
                hash: '#planification-careers',
                file: '/interfaces/planification/careers/careers.html',
                title: 'Carreras'
            },
            
            departments: {
                hash: '#planification-departments',
                file: '/interfaces/planification/departments/departments.html',
                title: 'Departamentos'
            },

            faculties: {
                hash: '#planification-faculties',
                file: '/interfaces/planification/faculties/faculties.html',
                title: 'Facultades'
            },
            
            socialService: {
                hash: '#planification-service',
                file: '/interfaces/planification/service/service.html',
                title: 'Servicio Social'
            },
            
            subjects: {
                hash: '#planification-subjects',
                file: '/interfaces/planification/subjects/subjects.html',
                title: 'Materias'
            },
            
            university: {
                hash: '#planification-university',
                file: '/interfaces/planification/university/university.html',
                title: 'Universidad'
            }

        },

        profile: {
            hash: '#profile',
            file: '/interfaces/profile/profile.html',
            title: 'Perfil'
        },

        system: {

            audit: {
                hash: '#system-audit',
                file: '/interfaces/system/audit/audit.html',
                title: 'Auditoría'
            },

            codes: {
                hash: '#system-codes',
                file: '/interfaces/system/codes/codes.html',
                title: 'Códigos'
            },
            
            roles: {
                hash: '#system-roles',
                file: '/interfaces/system/roles/roles.html',
                title: 'Roles'
            },
            
            users: {
                hash: '#system-users',
                file: '/interfaces/system/users/users.html',
                title: 'Usuarios'
            }

        }

    },

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
        },

    }

}