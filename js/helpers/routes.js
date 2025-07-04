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
        }

    },

    components: {

        body: {
            html: '/components/body/body.html',
            js: '/components/body/body.js'
        },

        footer: {
            html: '/components/footer/footer.html',
            js: '/components/footer/footer.js'
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