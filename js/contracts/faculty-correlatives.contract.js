import { makeContract } from "../lib/contract";
const {types: t} = makeContract ({ schema : {}});

export const FacultyCorrelativeContract = makeContract({
    schema : {
        facultyCorrelativeID: t.string({
            required: false
        }),
        facultyId: t.string({
            required: true
        }),
        correlativeNumber: t.number({
            required: true,
            min: 1,
            max: 10
        }),
        facultyName: t.string({
            required: false
        }),
    },
    scopes : {
        table: [
            'FacultyCorrelativeID',
            'facultyId',
            'correlativeNumber',
            'facultyName'
        ],
        create: [
            'facultyId',
            'correlativeNumber'
        ],
        update: [
            'facultyId',
            'correlativeNumber'
        ],
    },
});