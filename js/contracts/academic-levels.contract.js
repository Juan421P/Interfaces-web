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

/*import { makeContract } from "../lib/contract";

const { types : T} = makeContract({schema : {}});

export const AcademicLevelsContract = makeContract({
    schema:{
        academicLevelID: T.string({
            require: false
        }),
        universityID: T.string({
            require : true
        }),
        academicLevelName: T.string({
            require: true,
            min: 2,
            max:60
        }),
        universityName: T.string({
            require: true,
            min: 1,
            max: 100
            
        })
    },
    scopes:{
        create:[
            'universityID',
            'academicLevelName',
        ],
        update:[
            'academicLevelID',
            'academicLevelName'
        ],
        table:[
            'academicLevelID',
            'academicLevelName',
            'universityName'
        ]
    }
})*/