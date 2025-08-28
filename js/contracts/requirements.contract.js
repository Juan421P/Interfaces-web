import { makeContract } from "../lib/contract";
const { types: t } = makeContract({ schema: {}});

export const RequirementsContract = makeContract({
    schema:{
        requirementID: t.string({
            required:false
        }),
        universityID: t.string({
            required: true
        }),
        requirementName: t.string({
            required: true,
            min: 1,
            max: 120
        }),
        description: t.string({
            required: false,
            min: 1,
            max: 800
        }),
        universityName: t.string({
            required:false
        }),
    },
    scopes:{
        table: [
            'requirementID',
            'universityID',
            'requirementName',
            'description',
            'universityName'
        ],
        create: [
            'universityID',
            'requirementName',
            'description'
        ],
        update: [
            'universityID',
            'requirementName',
            'description'
        ]
    },
});