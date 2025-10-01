import { Contract } from './../lib/contract.js';

export class DepartmentsContract extends Contract {
    constructor() {
        super({
            schema: {
                departmentID: Contract.types.string({
                    required: true,
                    trim: true,
                    default: ""
                }),
                facultyID: Contract.types.string({
                    required: true,
                    trim: true,
                    default: ""
                }),
                departmentName: Contract.types.string({
                    required: true,
                    trim: true,
                    min: 3,
                    max: 100,
                    regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, // solo letras y espacios
                    default: ""
                }),
                departmentType: Contract.types.string({
                    required: true,
                    trim: true,
                    min: 2,
                    max: 10,
                    regex: /^[A-Z0-9]+$/, // mayúsculas y números
                    default: ""
                }),
                faculty: Contract.types.string({
                    required: true,
                    trim: true,
                    max: 500,
                    default: ""
                }),
                
            },
            scopes: {
                create: [
                    'facultyID',
                    'departmentName',
                    'departmentType',
                    'faculty',
                    
                ],
                update: [
                    'departmentID',
                    'facultyID',
                    'departmentName',
                    'departmentType',
                    'faculty',
                ],
                table: [
                    'departmentID',
                    'departmentName',
                    'departmentType',
                    'faculty',
                ],
                delete:[
                    'departmentID'
                ]
            }
        });
    }
}
