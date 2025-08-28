import { makeContract } from "../lib/contract";
const { types:t } = makeContract({ schema: {}});

export const PensaContract = makeContract({
    schema:{
        pensumID: t.string({
            required: false
        }),
        careerID: t.string({
            required: true
        }),
        version: t.string({
            required: true,
            min: 1,
            max: 20
        }),
        effectiveYear: t.number({
            required: true,
            min: 4,
            max: 4
        }),
        careerName: t.string({
            required: false
        }),
    },
    scopes: {
        table: [
            'pensumID',
            'careerID',
            'version',
            'effectiveYear',
            'careerName'
        ],
        create: [
            'careerID',
            'version',
            'effectiveYear'
        ],
        update: [
            'careerID',
            'version',
            'effectiveYear'
        ]
    }
});