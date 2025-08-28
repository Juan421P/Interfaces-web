import { makeContract } from "../lib/contract";
const { types: t } = makeContract({ schema: {} });

export const CourseOfferingTeachersContract = makeContract({
  schema: {
    courseOfferingTeacherID: t.string({
      required: false, 
      trim: true,
    }),
    courseOfferingID: t.string({
      required: true, 
      trim: true,
    }),
    employeeID: t.string({
      required: true,
      trim: true,
    }),
    employee: t.string({
      required: false, 
      trim: true,
    }),
    coureOffering: t.string({
      required: false, 
      trim: true,
    }),
  },
  scopes: {
    create:[
            'courseOfferingID',
            'employeeID',
        ],
        update:[
            'employee',
            'coureOffering',
        ],
        table:[
            'employee',
            'coureOffering',
        ]
  },
});
