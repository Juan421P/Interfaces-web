import { Service } from './../lib/service.js';
import { UsersContract } from './../contracts/users.contract.js';

export class UsersService extends Service {
    
    constructor() {
        super('/Users', new UsersContract());
    }

    async getAll() {
        return await this.get('getUsersPagination', null, 'table');
    }

    async create(userData) {
        return await this.post('AddUser', userData, 'create');
    }

    async update(userData) {
        return await this.put('UpdateUser', userData, 'update');
    }

    async delete(id) {
        return await this.delete('DeleteUser', id);
    }

}