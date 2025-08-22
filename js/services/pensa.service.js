export const PensaService = {
    async list() {
        return Promise.resolve([
            {
                pensumID: 1,
                careerName: 'Ingeniería en Sistemas',
                year: 2023,
                cycles: [
                    {
                        cycle: 'I',
                        subjects: [
                            { code: 'MAT101', name: 'Matemática I', uv: 4 },
                            { code: 'PROG101', name: 'Programación I', uv: 4 }
                        ]
                    },
                    {
                        cycle: 'II',
                        subjects: [
                            { code: 'DBD304', name: 'Bases de Datos I', uv: 4 }
                        ]
                    }
                ]
            },
            {
                pensumID: 2,
                careerName: 'Licenciatura en Matemática',
                year: 2024,
                cycles: [
                    {
                        cycle: 'I',
                        subjects: [
                            { code: 'CAL101', name: 'Cálculo Diferencial', uv: 5 }
                        ]
                    }
                ]
            }
        ]);
    },

    async create(data) {
        console.log('[Mock Create Pensum]', data);
        return Promise.resolve({ ...data, pensumID: Math.floor(Math.random() * 1000) });
    }
};
