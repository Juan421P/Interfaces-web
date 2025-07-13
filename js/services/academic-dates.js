export const AcademicDatesService = {
    _dates: [
        { id: '1', date: '2025-07-10', eventTypeID: 'evt1', eventName: 'Inicio semestre' },
        { id: '2', date: '2025-07-15', eventTypeID: 'evt2', eventName: 'Evaluación parcial' }
    ],

    async listByMonth(year, month) {
        const prefix = `${year}-${String(month).padStart(2, '0')}`;
        return this._dates.filter(d => d.date.startsWith(prefix));
    },

    async create(data) {
        const newId = (this._dates.length + 1).toString();
        this._dates.push({ id: newId, ...data });
        console.log('Created academic date', data);
        return Promise.resolve();
    },

    async update(id, data) {
        const idx = this._dates.findIndex(d => d.id === id);
        if (idx >= 0) {
            this._dates[idx] = { id, ...data };
            console.log('Updated academic date', id, data);
        }
        return Promise.resolve();
    }
};