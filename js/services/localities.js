const mockLocalities = [
  {
    localityID: 'loc1',
    universityID: 'uni1',
    isMainLocality: true,
    address: 'Calle Principal 123, Ciudad De Paz',
    phoneNumber: '+503 1234 5678'
  },
  {
    localityID: 'loc2',
    universityID: 'uni1',
    isMainLocality: false,
    address: 'Avenida Secundaria 456, Ciudad Guinea',
    phoneNumber: '+503 8765 4321'
  },
  {
    localityID: 'loc3',
    universityID: 'uni1',
    isMainLocality: false,
    address: 'Colonia Central 789, Ciudad Escamilla',
    phoneNumber: '+503 1122 3344'
  }
];

export const LocalitiesService = {
  async list() {
    return new Promise(resolve => {
      setTimeout(() => resolve(mockLocalities), 250);
    });
  },

  async get(localityID) {
    return new Promise(resolve => {
      setTimeout(() => {
        const loc = mockLocalities.find(l => l.localityID === localityID);
        resolve(loc || null);
      }, 200);
    });
  }
};
