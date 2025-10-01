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
                name: Contract.types.string({
                    required: true,
                    trim: true,
                    min: 3,
                    max: 100,
                    regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, // solo letras y espacios
                    default: ""
                }),
                code: Contract.types.string({
                    required: true,
                    trim: true,
                    min: 2,
                    max: 10,
                    regex: /^[A-Z0-9]+$/, // mayúsculas y números
                    default: ""
                }),
                description: Contract.types.string({
                    required: false,
                    trim: true,
                    max: 500,
                    default: ""
                }),
                facultyID: Contract.types.string({
                    required: true,
                    trim: true,
                    default: ""
                })
            },
            scopes: {
                create: [
                    "name",
                    "code",
                    "description",
                    "facultyID"
                ],
                update: [
                    "departmentID",
                    "name",
                    "code",
                    "description",
                    "facultyID"
                ],
                list: [
                    "departmentID",
                    "name",
                    "code",
                    "description",
                    "facultyID"
                ]
            }
        });
    }
}
