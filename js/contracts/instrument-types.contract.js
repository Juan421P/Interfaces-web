import { makeContract } from "../lib/contract";
const { types:t } = makeContract({ schema: {}});

export const InstrumentTypesContract = makeContract({
    schema: {
        instrumentTypeID: t.string({
            required: false
        }),
        universityID: t.string({
            required: true
        }),
        instrumentTypeName: t.string({
            required: true,
            min: 1,
            max: 60
        }),
        universityName: t.string({
            required: false
        }),
    },
    scopes: {
        table: [
            'instrumentTypeID',
            'universityID',
            'universityName',
            'instrumentTypeName'
        ],
        create: [
            'universityID',
            'instrumentTypeName'
        ],
        update: [
            'universityID',
            'instrumentTypeName'
        ]
    }
});