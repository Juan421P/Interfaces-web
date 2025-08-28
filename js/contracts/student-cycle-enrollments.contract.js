import { makeContract } from './../lib/contract.js';

const { types: t } = makeContract({ schema: {} });

export const studentCycleEnrollentsContract = makeContract({
    schema:{
        studentCycleEnrollentID: t.string({
            required: false
        }),
        studentCareerEnrollmentID: t.string({
            required: true
        }),
        yearCycleID: t.string({
            required: true
        }),
        status: t.string({
            required: true
        }),
        registeredAt: t.date({
            required: true,
            coerce: true
        }),
        completedAt: t.date({
            required: false,
            coerce: true
        }),
    },
    scopes:{
        create:[
            'studentCareerEnrollmentID',
            'yearCycleID',
            'status',
            'registeredAt',
        ],
        update:[
            'studentCycleEnrollmentID',
            'status',
            'registeredAt',
            'completedAt',
        ],
        table:[
            'studentCycleEnrollmentID',
            'status',
            'registeredAt'
        ]
    }
})