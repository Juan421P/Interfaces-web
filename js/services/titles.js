export const TitlesService = {
    async list() {
        return Promise.resolve([
            { degreeTypeID: 1, degreeTypeName: 'Licenciatura' },
            { degreeTypeID: 2, degreeTypeName: 'Ingeniería' },
            { degreeTypeID: 3, degreeTypeName: 'Doctorado' }
        ]);
    },

    async create(data) {
        console.log('[Mock Create Title]', data);
        return Promise.resolve({ ...data, degreeTypeID: Math.floor(Math.random() * 1000) });
    }
};
