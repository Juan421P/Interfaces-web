export const ROUTES = {

    interfaces: {

        login:{
            path: './pages/login.html',
            title: 'Inicio de sesión'
        },

        app:{
            path: './index.html',
            title: 'Aplicación'
        },

    },

    views: {

        main:{
            hash: '#main',
            file: './pages/main.html',
            title: 'Inicio'
        },

        students:{
            hash: '#students',
            file: './pages/students.html',
            title: 'Estudiantes'
        },

    },

    components: {

        body: {
            html: './components/body/body.html',
            js: './components/body/body.js'
        },

        footer: {
            html: './components/footer/footer.html',
            js: './components/footer/footer.js'
        },

        toast: {
            html: './components/toast/toast.html',
            js: './components/toast/toast.js'
        },

    }

}