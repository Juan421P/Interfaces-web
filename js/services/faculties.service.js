import { Service } from './../lib/service.js';
import { FacultiesContract } from './../contracts/faculties.contract.js';

export class FacultiesService extends Service {

    static baseEndpoint = '/Faculties';
    static contract = new FacultiesContract();

    static async getAll() {
        return await this.get(null, null, null, 'getAll');
    }

    static async create(data) {
        return await this.post(null, data, 'create');
    }

    static async update(id, data) {
        return await this.put(id, data, 'update');
    }

    static async delete(id) {
        return await this.remove(id, null, 'delete');
    }
    
}