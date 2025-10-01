import { Contract } from './../lib/contract.js';

export class SubjectDefinitionsContract extends Contract {
    constructor() {
        super({
            schema: {
                subjectID: Contract.types.string({
                    required: false,
                    default: ""
                }),
                subjectName: Contract.types.string({
                    required: true,
                    trim: true,
                    min: 3,
                    max: 100,
                    regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
                    default: ""
                }),
                subjectCode: Contract.types.string({
                    required: true,
                    trim: true,
                    regex: /^[A-Z]{3,5}[0-9]{2,3}$/, 
                    default: ""
                }),
                valueUnits: Contract.types.number({
                    required: true,
                    min: 1,
                    max: 10,
                    default: 1
                })
            },
            scopes: {
                table: [
                    "subjectID",
                    "subjectName",
                    "subjectCode",
                    "valueUnits"
                ],
                create: [
                    "subjectName",
                    "subjectCode",
                    "valueUnits"
                ],
                update: [
                    "subjectID",
                    "subjectName",
                    "subjectCode",
                    "valueUnits"
                ]
            }
        });
    }
}
