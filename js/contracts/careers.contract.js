import { makeContract } from "../lib/contract";
const { types: t } = makeContract({ schema: {} });

export const CareersContract = makeContract({
  schema: {
    id: t.string({
      required: false,
      trim: true,
    }),
    academicLevelId: t.string({
      required: true, 
      trim: true,
    }),
    degreeTypeId: t.string({
      required: true,
      trim: true,
    }),
    modalityId: t.string({
      required: true, 
      trim: true,
    }),
    departmentId: t.string({
      required: true,
      trim: true,
    }),
    name: t.string({
      required: true, 
      min: 1,
      max: 150,
      trim: true,
    }),
    careerCode: t.string({
      required: true, 
      min: 1,
      max: 30,
      trim: true,
    }),
    description: t.string({
      required: false, 
      max: 1000,
      trim: true,
    }),
    minPassingScore: t.number({
      required: true, 
      min: 0,
      max: 10,
      default: 6.0,
    }),
    minMUC: t.number({
      required: true,
      min: 0, 
      default: 0.0,
    }),
    compulsorySubjects: t.int({
      required: true,
      min: 0, 
      default: 0,
    }),
    totalValueUnits: t.int({
      required: true,
      min: 1,
    }),
    academicLevelName: t.string({
      required: false, 
      trim: true,
    }),
    modalityName: t.string({
      required: false, 
      trim: true,
    }),
    degreeTypeName: t.string({
      required: false,
      trim: true,
    }),
  },
  scopes: {
    create:[
        'academicLevelId',
        'degreeTypeId',
        'modalityId',
        'departmentId',
        'name',
        'careerCode',
        'description',
        'minPassingScore',
        'minMUC',
        'compulsorySubjects',
        'totalValueUnits',
        'academicLevelName',
        'modalityName'
    ],
    update:[
        'academicLevelId',
        'degreeTypeId',
        'modalityId',
        'departmentId',
        'name',
        'careerCode',
        'description',
        'minPassingScore',
        'minMUC',
        'compulsorySubjects',
        'totalValueUnits',
        'academicLevelName',
        'modalityName'
    ],
    table:[
        'academicLevelId',
        'degreeTypeId',
        'modalityId',
        'departmentId',
        'name',
        'careerCode',
        'description',
        'minPassingScore',
        'minMUC',
        'compulsorySubjects',
        'totalValueUnits',
        'academicLevelName',
        'modalityName'
    ],



  }
});
