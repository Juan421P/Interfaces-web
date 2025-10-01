import { Service } from './../lib/service.js';
import { DepartmentsContract } from './../contracts/departments.contract.js';

export class DepartmentsService extends Service {
    
    constructor() {
        super('/Departments', new DepartmentsContract());
    }

    async getAll() {
        return await this.get('getDepartmentsPagination', null, 'table');
    }

    async create(notificationData) {
        return await this.post('newDepartment', notificationData, 'create');
    }

    async update(notificationData) {
        return await this.put('updateDepartment', notificationData, 'update');
    }

    async delete(id) {
        return await this.delete('deleteDeparmentn', id);
    }

}