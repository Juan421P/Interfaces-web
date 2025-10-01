import { makeContract } from "../lib/contract";
const { types: t } = makeContract({ schema: {} });

export const PensaContract = makeContract({
    schema: {
        PensumID: t.string({
            required: false
        }),
        CareerID: t.string({
            required: true
        }),
        Version: t.string({
            required: true,
            min: 1,
            max: 20
        }),
        EffectiveYear: t.string({
            required: true,
            regex: /^(19|20)\d{2}$/
        }),
        career: t.string({
            required: false
        }),
    },
    scopes: {
        table: [
            'PensumID',
            'CareerID',
            'Version',
            'EffectiveYear',
            'career'
        ],
        create: [
            'CareerID',
            'Version',
            'EffectiveYear'
        ],
        update: [
            'CareerID',
            'Version',
            'EffectiveYear'
        ]
    }
});
