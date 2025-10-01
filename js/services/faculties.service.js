import { Service } from './../lib/service.js';
import { FacultyContract } from '../contracts/faculties.contract.js'

export class FacultiesService extends Service {
    
    constructor() {
        super('/Faculties', new FacultyContract());
    }

    async getAll() {
        return await this.get('getFaculties', null, 'table');
    }

    async create(systemRolData) {
        return await this.post('newFaculties', systemRolData, 'create');
    }

    async update(systemRolData) {
        return await this.put('updateFaculty', systemRolData, 'update');
    }

    async delete(id) {
        return await this.delete('deleteFaculty', id);
    }

}