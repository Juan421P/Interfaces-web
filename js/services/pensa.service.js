import { Service } from './../lib/service.js';
import { PensaContract } from "../contracts/pensa.contract";

export class PensaService extends Service {
    
    constructor() {
        super('/Pensum', new PensaContract());
    }

    async getAll() {
        return await this.get('getPensumPagination', null, 'table');
    }

    async create(Data) {
        return await this.post('newPensum', Data, 'create');
    }

    async update(Data) {
        return await this.put('updatePensum', Data, 'update');
    }

    async delete(id) {
        return await this.delete('deletePensum', id);
    }

}
