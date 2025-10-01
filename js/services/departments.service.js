import { Service } from './../lib/service.js';
import { DepartmentsContract } from './../contracts/departments.contract.js';

export class DepartmentsService extends Service {
    static baseEndpoint = '/Departments';
    static contract = new DepartmentsContract();
}