 import { makeContract } from "../lib/contract";
 const { types: t } = makeContract({ schema: {} });
 
 export const CourseOfferingsContract = makeContract({
   schema: {
     subjectID: t.string({
       required: true
     }),
     yearCycleID: t.string({
       required: true
     }),
     courseOfferingID: t.string({
       required: false
     }),
     yearcycleName: t.string({
       required: false, 
       trim: true,
     }),
     subject: t.string({
       required: false, 
       trim: true,
     }),
   },
   scopes: {
     create:[
            'yearCycleID',
            'courseOfferingID'
        ],
         update:[
            'yearCycleID',
            'courseOfferingID'
        ],
         table:[
            'subject',
            'yearcycleName',
        ]
   },
 });
 