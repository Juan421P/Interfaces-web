import { Service } from './../lib/service.js';
import { FacultyLocalitiesContract } from '../contracts/faculty-correlatives.contract.js'

export class FacultyCorrelativesService extends Service {
    
    constructor() {
        super('/FacultyLocalities', new FacultyLocalitiesContract());
    }

    async getAll() {
        return await this.get('getFacultiesLocalitiesPagination', null, 'table');
    }

    async create(FacultyLocalitiesData) {
        return await this.post('AddFacultyLocality', FacultyLocalitiesData, 'create');
    }

    async update(FacultyLocalitiesData) {
        return await this.put('UpdateFacultyLocality', FacultyLocalitiesData, 'update');
    }

    async delete(id) {
        return await this.delete('DeleteFacultyLocality', id);
    }

}
