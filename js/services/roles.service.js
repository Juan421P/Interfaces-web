export const RolesService = {
    async list() {
        return [
            { roleID: 1, roleName: 'Administrador del Sistema', roleType: 'admin' },
            { roleID: 2, roleName: 'Administrador de RA', roleType: 'ar' },
            { roleID: 3, roleName: 'Docente', roleType: 'teacher' },
            { roleID: 4, roleName: 'Administrador de RH', roleType: 'hr' },
            { roleID: 5, roleName: 'Estudiante', roleType: 'student' }
        ];
    }
};