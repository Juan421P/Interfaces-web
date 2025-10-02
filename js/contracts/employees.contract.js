import { Contract, makeContract } from './../lib/contract.js';

export class EmployeesContract extends Contract{
    constructor(){
        super({
            schema: {
                id: Contract.types.string({
                    required: true,
                    default: ''
                }),
                personID: Contract.types.string({
                    required: true,
                    default: ''
                }),
                departmentID: Contract.types.string({
                    required: true,
                    default: ''
                }),
                employeeCode: Contract.types.string({
                    required: true,
                    default: ''
                }),
                EmployeeDetail: Contract.types.string({
                    required: true,
                    detail: ''
                }),
                personName: Contract.types.string({
                    required: true,
                    detail: ''
                }),
                personLastName: Contract.types.string({
                    required: true,
                    detail: ''
                }),
            },
            scopes:{
                create: [
                    'personID',
                    'departmentID',
                    'employeeCode',
                    'EmployeeDetail',
                    'personName',
                    'personLastName'
                ],
                table: [
                    'id',
                    'personID',
                    'departmentID',
                    'employeeCode',
                    'EmployeeDetail',
                    'personName',
                    'personLastName'
                ],
                update: [
                    'personID',
                    'departmentID',
                    'employeeCode',
                    'EmployeeDetail',
                    'personName',
                    'personLastName'
                ],
                delete: [
                    'id'
                ]
            }
        })
    }
}
