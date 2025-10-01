import { makeContract } from "../lib/contract";
const { types: t } = makeContract({schema: {}});

export const FacultyLocalitiesContract = makeContract({
    schema:{
        id: t.string({
            required: false
        }),
        facultyID: t.string({
            required: true
        }),
        localityID: t.string({
            required: true
        }),
        faculties: t.string({
            required: false
        }),
        localities: t.string({
            required: false
        }),
    },
    scopes:{
        table: [
            'facultyLocalityID',
            'facultyID',
            'localityID',
            'faculties',
            'localities'
        ],
        create: [
            'facultyID',
            'localityID'
        ],
        update: [
            'facultyID',
            'localityID'
        ],
        delete:[
            'facultyLocalityID'
        ]
        
    },
});