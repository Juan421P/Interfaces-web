import { makeContract } from "../lib/contract";
const { types: t } = makeContract({ schema: {} });

export const CourseEnrollmentsContract = makeContract({
  schema: {
    id: t.string({
      required: false,
    }),
    courseOfferingId: t.string({
      required: true, 
    }),
    studentCareerEnrollmentId: t.string({
      required: true, 
    }),
    enrollmentStatus: t.string({
      required: true,
      min: 1,
      max: 20, 
      trim: true,
    }),
    finalGrade: t.number({
      required: false, 
      min: 0,
      max: 10, 
    }),
    enrollmentDate: t.date({
      required: true, 
      coerce: true,
    }),
    meritUnit: t.number({
      required: true, 
      min: 0, 
      default: 0,
    }),
    courseOfferingName: t.string({
      required: false, 
      trim: true,
    }),
    studentName: t.string({
      required: false,
      trim: true,
    }),
    careerName: t.string({
      required: false,
      trim: true,
    }),
  },
  scopes: {
    create:[
            'courseOfferingId',
            'studentCareerEnrollmentId',
            'enrollmentStatus',
            'finalGrade',
            'enrollmentDate',
            'meritUnit',
            'courseOfferingName'
        ],
        update:[
            'courseOfferingId',
            'studentCareerEnrollmentId',
            'enrollmentStatus',
            'finalGrade',
            'enrollmentDate',
            'meritUnit',
            'courseOfferingName'
        ],
        table:[
            'enrollmentStatus',
            'finalGrade',
            'enrollmentDate',
            'meritUnit',
            'courseOfferingName',
            'studentName',
            'careerName'
        ]
  },
});

