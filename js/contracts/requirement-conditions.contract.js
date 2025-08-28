import { makeContract } from "../lib/contract";
const { types: t } = makeContract({ schema: {}});

export const RequirementConditionsContract = makeContract({
    schema:{
        conditionID: t.string({
            required: false
        }),
        requirementID:t.string({
            required: true
        }),
        subjectID: t.string({
            required: true
        }),
        requirementName: t.string({
            required: false
        }),
        subjectName: t.string({
            required: false
        }),
    },
    scopes:{
        table: [
            'conditionID',
            'requirementID',
            'subjectID',
            'requirementName',
            'subjectName'
        ],
        create: [
            'requirementID',
            'subjectID'
        ],
        update: [
            'requirementID',
            subjectID
        ],
    },
});