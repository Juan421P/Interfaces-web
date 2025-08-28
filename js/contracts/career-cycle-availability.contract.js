import { makeContract } from "../lib/contract";
const {types : t} = makeContract ({schema : {}});

export const CarrerCycleAvailabilityContract = makeContract({
    schema:{
        id : t.string({
            require: false
        }),
        yearCycleId: t.string({
            require: true
        }),
        careerId: t.string({
            require:true
        }),
        career: t.string({
            require: false,
            min: 1,
            max: 150    
        }),
        yearCycle: t.string({
            require: false,
        
        })
    },
    scopes:{
        create: [
            'yearCycleId',
            'careerId'
        ],
        update: [
            'yearCycleId',
            'careerId'
        ],
        table: [
            'career',
            'yearCycle'
        ]

        
    }
})