export const EventTypesService = {
    async list() {
        return Promise.resolve([
            { eventTypeID: 'evt1', typeName: 'Inicio' },
            { eventTypeID: 'evt2', typeName: 'Evaluación' },
            { eventTypeID: 'evt3', typeName: 'Cierre' }
        ]);
    }
};
