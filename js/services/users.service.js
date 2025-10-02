import { Service } from './../lib/service.js';
import { UsersContract } from './../contracts/users.contract.js';

export class UsersService extends Service {
    
    static baseEndpoint = '/Users';
    static contract = new UsersContract();

    static async list() {
        return await this.get('getUsersPagination', null, 'table');
    }

    static async create(userData) {
        return await this.post('AddUser', userData, 'create');
    }

    static async update(userData) {
        return await this.put('UpdateUser', userData, 'update');
    }

    static async delete(id) {
        return await this.delete('DeleteUser', id);
    }
}