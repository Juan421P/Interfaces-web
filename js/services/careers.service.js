import { Service } from './../lib/service.js';
import { CareersContract } from './../contracts/careers.contract.js';

export class CareersService extends Service {
    
    constructor() {
        super('/Careers', new CareersContract());
    }

    async getAll() {
        return await this.get('getCareersPaginated', null, 'table');
    }

    async create(Data) {
        return await this.post('insertCareer', Data, 'create');
    }

   async update(Data) {
        return await this.put('updateCareer', Data, 'update');
  }

    async delete(id) {
        return await this.delete('deleteCareer', id);
    }

}