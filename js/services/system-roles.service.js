import { Service } from './../lib/service.js';
import { systemRolesContract } from '../contracts/system-roles.contract.js'

export class systemRolesService extends Service {
    
    constructor() {
        super('/SystemRol', new systemRolesContract());
    }

    async getAll() {
        return await this.get('getSystemRol', null, 'table');
    }

    async create(systemRolData) {
        return await this.post('newSystemaRol', systemRolData, 'create');
    }

    async update(systemRolData) {
        return await this.put('updateSystemRol', systemRolData, 'update');
    }

    async delete(id) {
        return await this.delete('eliminarSystemRol', id);
    }

}