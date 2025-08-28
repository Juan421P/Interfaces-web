import { makeContract } from './../lib/contract.js';

const { types: t } = makeContract({ schema: {} });

export const EvaluationPlansContract = makeContract({
    schema: {
        evaluationPlanID: t.string({
            required: false
        }),
        rubric: t.string({
            required: false
        }),
        planName: t.string({
            required: true,
            min: 1,
            max: 120,
            trim: true
        }),
        weightPercentage: t.number({
            required: true
        }),
        orderIndex: t.number({
            required: true
        }),
    },
    scopes: {
        create: [
            'rubric',
            'planName',
            'weightPercentage',
            'orderIndex'
        ],
        update: [
            'evaluationPlanID',
            'rubric',
            'planName',
            'weightPercentage',
            'orderIndex'
        ],
        table: [
            'evaluationPlanID',
            'planName',
            'weightPercentage',
            'orderIndex'
        ],
    },
});
