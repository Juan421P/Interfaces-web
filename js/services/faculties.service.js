import { Service } from './../lib/service.js';
import { FacultiesContract } from './../contracts/faculties.contract.js';

export class FacultiesService extends Service {
    
    constructor() {
        super('/Faculties', new FacultiesContract());
    }

    async getAll() {
        return await this.get('getFacultiesPagination', null, 'table');
    }

    async create(FacultiesData) {
        return await this.post('newFaculties', FacultiesData, 'create');
    }

    async update(FacultiesData) {
        return await this.put('updateFaculty', FacultiesData, 'update');
    }

    async delete(id) {
        return await this.delete('deleteFaculty', id);
    }

}