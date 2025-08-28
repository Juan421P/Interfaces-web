import { makeContract } from "../lib/contract";
const { types: t } = makeContract({ schema: {}});

export const PersonTypesContract = makeContract({
    schema: {
        personTypeID: t.string({
            required: false
        }),
        personType: t.string({
            required: true,
            min: 1,
            max: 50
        }),
    },
    scopes: {
        table: [
            'personTypeID',
            'personType'
        ],
        create: [
            'personType'
        ],
        update: [
            'personType'
        ],
    },
});