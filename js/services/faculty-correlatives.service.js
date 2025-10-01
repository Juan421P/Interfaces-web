import { Service } from './../lib/service.js';
import { FacultyCorrelativeContract } from '../contracts/faculty-correlatives.contract.js'

export class FacultyCorrelativesService extends Service {
    
    constructor() {
        super('/FacultyCorrelative', new FacultyCorrelativeContract());
    }

    async getAll() {
        return await this.get('getFacultiesCorrelativesPagination', null, 'table');
    }

    async create(FacultyCorrelativeData) {
        return await this.post('newFacultyCorrelatives', systemRolData, 'create');
    }

    async update(FacultyCorrelativeData) {
        return await this.put('updateFacultyCorrelatives', systemRolData, 'update');
    }

    async delete(id) {
        return await this.delete('deleteFacultyCorrelatives', id);
    }

}
