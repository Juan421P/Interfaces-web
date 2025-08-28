 import { makeContract } from "../lib/contract";
 const { types: t } = makeContract({ schema: {} });
 
 export const CycleTypesContract = makeContract({
   schema: {
     id: t.string({
       required: false
     }),
     universityID: t.string({
       required: true
     }),
     universityName: t.string({
       required: false, 
       trim: true,
     }),
     cycleLabel: t.string({
       required: true, 
       trim: true,
     })
     
   },
   scopes: {
     create:[
            'universityID',
            'cycleLabel'
        ],
         update:[
            'universityID',
            'cycleLabel'
        ],
         table:[
            'universityName',
            'cycleLabel',
        ]
   },
 });
 