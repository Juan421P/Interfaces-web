import { fetchJSON } from './../helpers/network';

const ENDPOINT = '/aMIj5J/users';

export const UsersService = {
    async list() {
        return fetchJSON(ENDPOINT);
    },

    async listMockup() {
        return Promise.resolve([
            { userID: 1, firstName: 'María', lastName: 'González', email: 'maria.gonzalez@uni.edu', studentID: 1001, careerName: 'Ingeniería en Sistemas' },
            { userID: 2, firstName: 'Luis', lastName: 'Martínez', email: 'luis.martinez@uni.edu', role: 'teacher', departmentName: 'Matemática' },
            { userID: 3, firstName: 'Ana', lastName: 'Ruiz', email: 'ana.ruiz@uni.edu', role: 'staff', roleName: 'Coordinadora de Becas' },
            { userID: 4, firstName: 'Carlos', lastName: 'Navarro', email: 'carlos.navarro@uni.edu', studentID: 1002, careerName: 'Arquitectura' },
            { userID: 5, firstName: 'Sofía', lastName: 'López', email: 'sofia.lopez@uni.edu', role: 'teacher', departmentName: 'Física' },
            { userID: 6, firstName: 'Miguel', lastName: 'Peralta', email: 'miguel.peralta@uni.edu', role: 'staff', roleName: 'Administrador del Sistema' },
            { userID: 7, firstName: 'Valeria', lastName: 'Torres', email: 'valeria.torres@uni.edu', studentID: 1003, careerName: 'Psicología' },
            { userID: 8, firstName: 'Javier', lastName: 'Romero', email: 'javier.romero@uni.edu', role: 'teacher', departmentName: 'Idiomas' },
            { userID: 9, firstName: 'Laura', lastName: 'Cruz', email: 'laura.cruz@uni.edu', role: 'staff', roleName: 'Secretaria Académica' },
            { userID: 10, firstName: 'Daniel', lastName: 'Pérez', email: 'daniel.perez@uni.edu', studentID: 1004, careerName: 'Medicina' },
            { userID: 11, firstName: 'Fernanda', lastName: 'Morales', email: 'fernanda.morales@uni.edu', role: 'teacher', departmentName: 'Biología' },
            { userID: 12, firstName: 'Héctor', lastName: 'Salinas', email: 'hector.salinas@uni.edu', role: 'staff', roleName: 'Encargado de TI' },
            { userID: 13, firstName: 'Andrea', lastName: 'Castro', email: 'andrea.castro@uni.edu', studentID: 1005, careerName: 'Derecho' },
            { userID: 14, firstName: 'Bruno', lastName: 'Linares', email: 'bruno.linares@uni.edu', role: 'teacher', departmentName: 'Filosofía' },
            { userID: 15, firstName: 'Cecilia', lastName: 'Velásquez', email: 'cecilia.velasquez@uni.edu', role: 'staff', roleName: 'Recursos Humanos' },
            { userID: 16, firstName: 'Gabriela', lastName: 'Domínguez', email: 'gabriela.dominguez@uni.edu', studentID: 1006, careerName: 'Diseño Gráfico' },
            { userID: 17, firstName: 'Iván', lastName: 'Cornejo', email: 'ivan.cornejo@uni.edu', role: 'teacher', departmentName: 'Historia' },
            { userID: 18, firstName: 'Natalia', lastName: 'Campos', email: 'natalia.campos@uni.edu', role: 'staff', roleName: 'Bibliotecaria' },
            { userID: 19, firstName: 'Óscar', lastName: 'Jiménez', email: 'oscar.jimenez@uni.edu', studentID: 1007, careerName: 'Contaduría Pública' },
            { userID: 20, firstName: 'Patricia', lastName: 'Mejía', email: 'patricia.mejia@uni.edu', role: 'teacher', departmentName: 'Administración' }
        ]);
    },

    async get(id){
        const user = await fetchJSON(`${ENDPOINT}/${id}`);
        return user;
    },

    async getByEmail(email) {
        const users = await fetchJSON(`${ENDPOINT}?email=${email}`);
        return users.length > 0 ? users[0] : null;
    },

    async login(email, password) {
        const user = await UsersService.getByEmail(email);
        if (!user) throw new Error('Usuario no encontrado 🥺');
        if (user.password.toString() !== password.toString()) throw new Error('Contraseña incorrecta 🥺');
        sessionStorage.setItem(
            'userID', user.id
        );
        return user;
    },

    async logout() {
        sessionStorage.clear();
    }
};