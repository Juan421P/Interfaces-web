import { Contract } from "../lib/contract.js";

export class AcademicLevelsContract extends Contract{
    constructor(){
        super({
            schema: {
                academicLevelID: Contract.types.string({
                    required: true,
                    default: ''
                }),
                universityID: Contract.types.string({
                    required: true,
                    default: ''
                }),
                academicLevelName: Contract.types.string({
                    required: true,
                    default: ''
                }),
                universityName: Contract.types.string({
                    required: true,
                    default: ''
                }),
            },
            scopes: {
                create: [
                    'universityID',
                    'academicLevelName',
                    'universityName'
                ],
                table: [
                    'academicLevelID',
                    'universityID',
                    'academicLevelName',
                    'universityName'
                ],
                update: [
                    'academicLevelID',
                    'universityID',
                    'academicLevelName',
                    'universityName'
                ],
                delete: [
                    'academicLevelID',
                ]
            }
        })
    }
}