import { makeContract } from "../lib/contract";
const {types : t} = makeContract ({schema : {}});

export const AcademicYearsContract = makeContract({
    schema:{
        academicYearId: t.string({
            require: false
        }),
        universityId: t.string({
            require: true,
        }),
        year: t.string({
            require: true,
            coerce: true,
        }),
        startDate: t.date({
            requiere: true,
            coerce: true,

        }),
        endDate: t.date({
            requiere: true,
            coerce: true
        }),
        cycleCount: t.number({
            requiere: true,

        }),
        allowInterCycle: t.char({
            requiere: true
        }),
        defaultInterCycle: t.int({
            requiere: true
        }),
        universityName: t.string({
            require: true
        })
    },
    scopes:{

    }
})