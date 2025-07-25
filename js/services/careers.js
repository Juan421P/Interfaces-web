export const CareersService = {
    async list() {
        return Promise.resolve([
            {
                careerName: 'Ingeniería en Sistemas',
                careerCode: '301',
                minPassingScore: 6.0,
                totalValueUnits: 180,
                description: 'Carrera enfocada en desarrollo de software y sistemas.',
                departmentID: 'd1'
            },
            {
                careerName: 'Licenciatura en Economía',
                careerCode: '401',
                minPassingScore: 6.5,
                totalValueUnits: 150,
                description: 'Formación en economía. 1+1=2',
                departmentID: 'd2'
            },
            {
                careerName: 'Licenciatura en Economía',
                careerCode: '501',
                minPassingScore: 6.5,
                totalValueUnits: 150,
                description: 'Formación en economía. 1+1=2',
                departmentID: 'd3'
            },
            {
                careerName: 'Doctorado en Peluquería',
                careerCode: '601',
                minPassingScore: 8,
                totalValueUnits: 200,
                description: 'La más profesional formación para aquellos valientes que osen adentrarse al oficio de la peluquería.',
                departmentID: 'd4'
            }
        ])
    }
}