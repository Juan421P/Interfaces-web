import { Service } from './../lib/service.js';
import { UniversityContract } from '../contracts/universities.contract.js'

export class UniversitiesService extends Service {
    
    constructor() {
        super('/University', new UniversityContract());
    }

    async getAll() {
        return await this.get('getDataUniversity', null, 'table');
    }

    async create(UniversityData) {
        return await this.post('newUniversity', UniversityData, 'create');
    }

    async update(UniversityData) {
        return await this.put('updateUniversity', UniversityData, 'update');
    }

    async delete(id) {
        return await this.delete('deleteUniversity', id);
    }

}