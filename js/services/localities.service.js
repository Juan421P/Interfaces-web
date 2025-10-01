import { Service } from './../lib/service.js';
import { LocalitiesContract } from '../contracts/localities.contract.js'

export class LocalitiesService extends Service {
    
    constructor() {
        super('/Locality', new LocalitiesContract());
    }

    async getAll() {
        return await this.get('getLocalitiesPagination', null, 'table');
    }

    async create(LocalityData) {
        return await this.post('newLocality', LocalityData, 'create');
    }

    async update(LocalityData) {
        return await this.put('updateLocality', LocalityData, 'update');
    }

    async delete(id) {
        return await this.delete('deleteLocation', id);
    }

}