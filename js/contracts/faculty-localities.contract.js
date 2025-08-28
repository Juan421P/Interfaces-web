import { makeContract } from "../lib/contract";
const { types: t } = makeContract({schema: {}});

export const FacultyLocalitiesContract = makeContract({
    schema:{
        facultyLocalityID: t.string({
            required: false
        }),
        facultyID: t.string({
            required: true
        }),
        localityID: t.string({
            required: true
        }),
        facultyName: t.string({
            required: false
        }),
        localityAddress: t.string({
            required: false
        }),
    },
    scopes:{
        table: [
            'facultyLocalityID',
            'facultyID',
            'localityID',
            'facultyName',
            'localityAddress'
        ],
        create: [
            'facultyID',
            'localityID'
        ],
        update: [
            'facultyID',
            'localityID'
        ],
    },
});