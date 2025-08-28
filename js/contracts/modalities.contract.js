import { makeContract } from "../lib/contract";
const { types: t } = makeContract({ schema: []});

export const ModalitiesContract = makeContract({
    schema:{
        modalityID: t.string({
            required: false
        }),
        universityID: t.string({
            required: true
        }),
        modalityName: t.string({
            required: true,
            min: 1,
            max: 50,
            trim:true
        }),
        universityName: t.string({
            required: false
        })
    },
    scopes:{
        table: [
            'modalityID',
            'universityID',
            'universityName',
            'modalityName'
        ],
        create: [
            'universityID',
            'modalityName'
        ],
        update: [
            'universityID',
            'modalityName'
        ],
    },
});