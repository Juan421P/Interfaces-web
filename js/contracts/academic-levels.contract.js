import { makeContract } from "../lib/contract";

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
})