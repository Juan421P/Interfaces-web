import { Contract } from './../lib/contract.js';

const SAFE_TEXT = /^[\w\s.,:/()\-#&@+]+$/i; // conservador y común en tus otros contratos

export class StudentCareerEnrollmentsContract extends Contract {
  constructor() {
    super({
      schema: {
        // Identificadores
        studentCareerEnrollmentID: Contract.types.string({
          required: false,
          trim: true,
          default: ''
        }),
        careerID: Contract.types.string({
          required: false,        // ← requerido en create/update vía scope
          trim: true,
          min: 1,
          default: '',
          regex: SAFE_TEXT
        }),
        studentID: Contract.types.string({
          required: false,        // ← requerido en create/update vía scope
          trim: true,
          min: 1,
          default: '',
          regex: SAFE_TEXT
        }),
        socialServiceProjectID: Contract.types.string({
          required: false,
          trim: true,
          default: '',
          regex: SAFE_TEXT
        }),

        // Fechas (LocalDate en backend)
        startDate: Contract.types.date({
          required: false
        }),
        endDate: Contract.types.date({
          required: false
        }),
        status: Contract.types.string({
          required: false,
          trim: true,
          default: '',
          regex: SAFE_TEXT
        }),
        statusDate: Contract.types.date({
          required: false
        }),
        serviceStartDate: Contract.types.date({
          required: false
        }),
        serviceEndDate: Contract.types.date({
          required: false
        }),
        serviceStatus: Contract.types.string({
          required: false,
          trim: true,
          default: '',
          regex: SAFE_TEXT
        }),
        serviceStatusDate: Contract.types.date({
          required: false
        }),

        // Derivados (solo lectura para UI)
        careerName: Contract.types.string({
          required: false,
          trim: true,
          default: ''
        }),
        studentName: Contract.types.string({
          required: false,
          trim: true,
          default: ''
        }),
        socialServiceProjectName: Contract.types.string({
          required: false,
          trim: true,
          default: ''
        }),
      },

      scopes: {
        // Lo que ENVÍAS al crear
        create: [
          'careerID',
          'studentID',
          'socialServiceProjectID',
          'startDate',
          'endDate',
          'status',
          'statusDate',
          'serviceStartDate',
          'serviceEndDate',
          'serviceStatus',
          'serviceStatusDate',
        ],

        // Lo que ENVÍAS al actualizar (ID va en la ruta)
        update: [
          'careerID',
          'studentID',
          'socialServiceProjectID',
          'startDate',
          'endDate',
          'status',
          'statusDate',
          'serviceStartDate',
          'serviceEndDate',
          'serviceStatus',
          'serviceStatusDate',
        ],

        // Lo que usas para tablas/listas
        table: [
          'studentCareerEnrollmentID',
          'studentName',
          'careerName',
          'status',
          'startDate',
          'endDate',
          'serviceStatus',
          'serviceStartDate',
          'serviceEndDate',
          'SocialServiceProjectName',
        ],

        delete: ['studentCareerEnrollmentID'],
      }
    });

    // Marcar requeridos vía scope (tu validador respeta required a nivel field;
    // si quieres que sea estricto por scope, mantenemos required=false en schema
    // y validas “mínimo 1” al estar en scope; ya pusimos min:1).
    // Si quieres hard-required, puedo poner required:true en careerID/studentID.
  }
}
