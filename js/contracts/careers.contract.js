import { Contract } from './../lib/contract.js';

export class CareersContract extends Contract {
  constructor() {
    super({
      schema: {
        careerID: Contract.types.string({
          required: true,
          trim: true,
          default: ""
        }),
        academicLevelId: Contract.types.string({
          required: true,
          trim: true,
          default: ""
        }),
        degreeTypeId: Contract.types.string({
          required: true,
          trim: true,
          default: ""
        }),
        modalityId: Contract.types.string({
          required: true,
          trim: true,
          default: ""
        }),
        departmentId: Contract.types.string({
          required: true,
          trim: true,
          default: ""
        }),
        name: Contract.types.string({
          required: true,
          trim: true,
          min: 3,
          max: 150,
          regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,-]+$/,
          default: ""
        }),
        careerCode: Contract.types.string({
          required: true,
          trim: true,
          min: 2,
          max: 30,
          regex: /^[A-Z0-9]+$/,
          default: ""
        }),
        description: Contract.types.string({
          required: false,
          trim: true,
          max: 1000,
          default: ""
        }),
        minPassingScore: Contract.types.number({
          required: true,
          min: 0,
          max: 10,
          default: 6.0
        }),
        minMUC: Contract.types.number({
          required: true,
          min: 0,
          default: 0.0
        }),
        compulsorySubjects: Contract.types.int({
          required: true,
          min: 0,
          default: 0
        }),
        totalValueUnits: Contract.types.int({
          required: true,
          min: 1,
          default: 1
        }),
        academicLevelName: Contract.types.string({
          required: false,
          trim: true,
          default: ""
        }),
        modalityName: Contract.types.string({
          required: false,
          trim: true,
          default: ""
        }),
        degreeTypeName: Contract.types.string({
          required: false,
          trim: true,
          default: ""
        })
      },
      scopes: {
        create: [
          "academicLevelId",
          "degreeTypeId",
          "modalityId",
          "departmentId",
          "name",
          "careerCode",
          "description",
          "minPassingScore",
          "minMUC",
          "compulsorySubjects",
          "totalValueUnits"
        ],
        update: [
          "careerID",
          "academicLevelId",
          "degreeTypeId",
          "modalityId",
          "departmentId",
          "name",
          "careerCode",
          "description",
          "minPassingScore",
          "minMUC",
          "compulsorySubjects",
          "totalValueUnits"
        ],
        list: [
          "careerID",
          "academicLevelId",
          "degreeTypeId",
          "modalityId",
          "departmentId",
          "name",
          "careerCode",
          "description",
          "minPassingScore",
          "minMUC",
          "compulsorySubjects",
          "totalValueUnits",
          "academicLevelName",
          "modalityName",
          "degreeTypeName"
        ]
      }
    });
  }
}
