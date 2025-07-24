export const DocumentsService = {
    async list() {
        return Promise.resolve([
            { documentID: 1, documentName: 'DUI', description: 'Documento Único de Identidad' },
            { documentID: 2, documentName: 'Título de Bachiller', description: 'Certificación de estudios medios' }
        ]);
    },

    async create(data) {
        console.log('[Mock Create Document]', data);
        return Promise.resolve({ ...data, documentID: Math.floor(Math.random() * 1000) });
    }
};
