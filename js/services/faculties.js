export const FacultiesService = {
    async list() {
        return Promise.resolve([
            {
                facultyID: 'f1',
                facultyName: 'Facultad de Ingeniería',
                facultyCode: 'ENG01',
                contactPhone: '+503 1234 5678',
                localityID: 'loc1'
            },
            {
                facultyID: 'f2',
                facultyName: 'Facultad de Ciencias Sociales',
                facultyCode: 'SOC02',
                contactPhone: '+503 8765 4321',
                localityID: 'loc2'
            },
            {
                facultyID: 'f3',
                facultyName: 'Facultad de Medicina',
                facultyCode: 'MED03',
                contactPhone: '+503 1122 3344',
                localityID: 'loc3'
            }, 
            {
                facultyID: 'f4',
                facultyName: 'Facultad de Joseo',
                facultyCode: 'JOS04',
                contactPhone: '+503 1231 5678',
                localityID: 'loc1'
            },
        ]);
    },

    async create(faculty) {
        console.log('Saving faculty', faculty);
        return Promise.resolve();
    }
};
