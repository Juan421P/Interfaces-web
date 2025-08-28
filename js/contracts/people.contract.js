import { makeContract } from "../lib/contract";
export const { types: t } = makeContract({ schema: {}});

export const PeopleContract = makeContract({
    schema: {
        personID: t.string({
            required:false
        }),
        personTypeID: t.string({
            required: true
        }),
        firstName: t.string({
            required: true,
            min: 1,
            max: 80
        }),
        lastName: t.string({
            required: true,
            min: 1,
            max: 80
        }),
        birthDate: t.date({
            required: true,
            ceorce: true
        }),
        contactEmail: t.number({
            required: true,
            min: 1,
            max: 120
        }),
        phone: t.string({
            required: false,
            min: 8,
            max: 25
        }),
        personTypeName: t.string({
            required: false
        })
    },
    scopes: {
        table: [
            'personID',
            'personTypeID',
            'firstName',
            'lastName',
            'birthDate',
            'contactEmail',
            'phone',
            'personTypeName'
        ],
        create: [
            'personTypeID',
            'firstName',
            'lastName',
            'birthDate',
            'contactEmail',
            'phone'
        ],
        update: [
            'personTypeID',
            'firstName',
            'lastName',
            'birthDate',
            'contactEmail',
            'phone'
        ]
    },
});