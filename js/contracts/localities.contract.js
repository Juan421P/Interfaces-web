import { makeContract } from "../lib/contract";
const { types: t} = makeContract({ schema: {}})

export const LocalitiesContract = makeContract({
    schema:{
        localityID: t.string({
            required: false
        }),
        universityID: t.string({
            required: true
        }),
        isMainLocality: t.string({
            required:true,
            min: 1,
            max: 1
        }),
        address: t.string({
            required: true,
            min: 1,
            max: 60
        }),
        phoneNumber: t.string({
            required: false,
            min: 8,
            max: 25
        }),
        universityName: t.string({
            required: false
        }),
    },
    scopes: {
        table: [
            'localityID',
            'universityName',
            'isMainLocality',
            'address',
            'phoneNumber'
        ],
        create: [
            'universityID',
            'isMainLocality',
            'address',
            'phoneNumber'
        ],
        update: [
            'localityID', 
            'universityID', 
            'isMainLocality', 
            'address', 
            'phoneNumber'
        ],
    },
});