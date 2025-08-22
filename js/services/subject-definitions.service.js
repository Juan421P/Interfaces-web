export const SubjectsService = {
    async list() {
        return [
            {
                subjectName: 'Matemáticas I',
                subjectCode: 'MAT101',
                valueUnits: 4
            },
            {
                subjectName: 'Programación Avanzada',
                subjectCode: 'PROG301',
                valueUnits: 5
            }
        ];;
    }
};