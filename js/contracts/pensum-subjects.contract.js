import { makeContract } from "../lib/contract";
export const { types: t } = makeContract({ schema: {}});

export const PensumSubjectsContract = makeContract({
    schema: {
        pensumSubjectID: t.string({
            required:false
        }),
        pensumID: t.string({
            required: true
        }),
        subjectID: t.string({
            required: true
        }),
        valueUnits: t.number({
            required: true,
            min: 1,
            max: 3
        }),
        isRequired: t.string({
            required: true,
            min: 1,
            max: 1
        }),
        pensumOrder: t.number({
            required: true,
            min: 1,
            max: 4
        }),
        pensumName: t.string({
            required: false
        }),
        subjectName: t.string({
            required: false
        })
    },
    scopes: {
        table: [
            'pensumSubjectID',
            'pensumID',
            'subjectID',
            'valueUnits',
            'isRequired',
            'pensumOrder',
            'pensumName',
            'subjectName'
        ],
        create: [
            'pensumID',
            'subjectID',
            'valueUnits',
            'isRequired',
            'pensumOrder'
        ],
        update: [
            'pensumID',
            'subjectID',
            'valueUnits',
            'isRequired',
            'pensumOrder'
        ]
    },
});