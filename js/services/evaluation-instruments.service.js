export const InstrumentsService = {
    async list() {
        return Promise.resolve([
            { instrumentID: 1, instrumentName: 'Examen Parcial', type: 'Teórico' },
            { instrumentID: 2, instrumentName: 'Investigación Final', type: 'Práctica' }
        ]);
    },

    async create(data) {
        console.log('[Mock Create Instrument]', data);
        return Promise.resolve({ ...data, instrumentID: Math.floor(Math.random() * 1000) });
    }
};
