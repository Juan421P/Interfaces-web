import { Service } from "../lib/service.js";
import { EmployeesContract } from "../contracts/employees.contract.js";

export class EmployeesService extends Service{

    constructor(){
        super('/Employees', new EmployeesContract());
    }

    async getAll(){
        return await this.get('getEmployees', null, 'table');
    }

    async create(employeesData){
        return await this.post('insertEmployee', employeesData, 'create');
    }

    async update(employeesData){
        return await this.put('updateEmployee', employeesData, 'update');
    }

    async delete(id){
        return await this.delete('deleteEmployee', id);
    }
}