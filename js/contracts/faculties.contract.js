import { Contract } from './../lib/contract.js';

export class FacultiesContract extends Contract {
    constructor() {
        super({
            schema: {
                facultyID: Contract.types.string({
                    required: true,
                    default: ''
                }),
                facultyName: Contract.types.string({
                    required: true,
                    trim: true,
                    default: ''
                }),
                facultyCode: Contract.types.string({
                    required: true,
                    trim: true,
                    default: ''
                }),
                contactPhone: Contract.types.string({
                    required: true,
                    trim: true,
                    regex: /^\+503\s\d{4}-\d{4}$/, // formato +503 1234-5678
                    default: ''
                }),
                correlativeCode: Contract.types.string({
                    required: true,
                    trim: true,
                    default: ''
                })
            },
            scopes: {
                create: [
                    'facultyName',
                    'facultyCode',
                    'contactPhone',
                    'correlativeCode'
                ],
                update: [
                    'facultyID',
                    'facultyName',
                    'facultyCode',
                    'contactPhone',
                    'correlativeCode'
                ],
                table: [
                    'facultyID',
                    'facultyName',
                    'facultyCode',
                    'contactPhone',
                    'correlativeCode'
                ],
                delete:[
                    'facultyID'
                ]
            }
        });
    }
}

