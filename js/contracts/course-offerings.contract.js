// contracts/course-offerings.contract.js
import { Contract } from './../lib/contract.js';

const SAFE_TEXT = /^[\w\s.,:/()\-#&@+]+$/i;

export class CourseOfferingsContract extends Contract {
  constructor() {
    super({
      schema: {
        courseOfferingID: Contract.types.string({
          required: false,
          trim: true,
          default: ''
        }),
        subjectID: Contract.types.string({
          required: true,      // @NotBlank en backend
          trim: true,
          min: 1,
          default: '',
          regex: SAFE_TEXT
        }),
        yearCycleID: Contract.types.string({
          required: true,      // @NotBlank en backend
          trim: true,
          min: 1,
          default: '',
          regex: SAFE_TEXT
        }),
        // Derivados para pintar en UI
        subject: Contract.types.string({
          required: false,
          trim: true,
          default: ''
        }),
        yearcycleName: Contract.types.string({
          required: false,
          trim: true,
          default: ''
        }),
      },
      scopes: {
        // lo que ENVÍAS al crear
        create: [
          'subjectID',
          'yearCycleID'
        ],
        // lo que ENVÍAS al actualizar (el id va en la ruta)
        update: [
          'subjectID',
          'yearCycleID'
        ],
        // lo que pintas en tablas/listas
        table: [
          'courseOfferingID',
          'subject',
          'yearcycleName'
        ],
        delete: ['courseOfferingID']
      }
    });
  }
}
