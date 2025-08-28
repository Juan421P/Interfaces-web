import { makeContract } from './../lib/contract.js';
const { types: t } = makeContract({ schema: {} });

export const studentEvaluationContract = makeContract({
    schema:{
        studentEvaluationID: t.string({
            required: false
        }),
        componentID: t.string({
            required: true
        }),
        courseEnrollmentID: t.string({
            required: true
        }),
        score: t.number({
            required: true
        }),
        feedback: t.string({
            required: false
        }),
        submittedAt: t.date({
            required: true,
            coerse: true
        }),
    },
    scopes:{
        create:[
            'componentID',
            'courseEnrollmentID',
            'score',
            'submittedAt',
        ],
        update:[
            'studentEvaluationID',
            'score',
            'feedback',
        ],
        table:[
            'studentEvaluationID',
            'score',
            'feedback',
            'submittedAt',
        ],
    },
});