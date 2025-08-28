import { makeContract } from './../lib/contract.js';
const { types: t } = makeContract({ schema: {} });
export const studentDocumentsContract = makeContract({
    schema: {
        studentDocumentID: t.string({
            required: false
        }),
        studentID: t.string({
            required: true
        }),
        documentID: t.string({
            required: true
        }),
        submitted: t.string({
            required: true,
            min: 1,
            max: 1,
            trim: true
        }),
        submissionDate: t.date({
            required: false,
            coerse: true
        }),
        verified: t.string({
            required: true,
            min: 1,
            max: 1,
            trim: true
        }),
    },
    scopes:{
        create:[
            'studentID',
            'documentID',
            'submitted',
            'verified',
        ],
        update:[
            'studentDocumentID',
            'submitted',
            'submissionDate',
            'verified',
        ],
        table:[
            'studentDocumentID',
            'submitted',
            'verified'
        ]
    }
})