import { Contract } from './../lib/contract.js';

const SAFE_TEXT = /^[\w\s.,:/()\-#&@+]+$/i;

export class StudentCycleEnrollmentsContract extends Contract {
  constructor() {
    super({
      schema: {
        // IDs
        id: Contract.types.string({
          required: false,
          trim: true,
          default: ''
        }),

        studentCareerEnrollmentId: Contract.types.string({
          // requerido para create/update
          required: true,
          trim: true,
          min: 1,
          default: '',
          regex: SAFE_TEXT
        }),

        yearCycleID: Contract.types.string({
          // requerido para create/update
          required: true,
          trim: true,
          min: 1,
          default: '',
          regex: SAFE_TEXT
        }),

        // Estado
        status: Contract.types.string({
          // @NotBlank en backend → requerido aquí
          required: true,
          trim: true,
          min: 1,
          max: 100,
          default: '',
          regex: SAFE_TEXT
        }),

        // Fechas (LocalDate en backend)
        registeredAt: Contract.types.date({
          required: false
        }),
        completedAt: Contract.types.date({
          required: false
        }),

        // Derivados / lectura
        studentcareerenrollment: Contract.types.string({
          required: false,
          trim: true,
          default: ''
        }),
        yearcycle: Contract.types.string({
          required: false,
          trim: true,
          default: ''
        })
      },

      scopes: {
        // lo que ENVÍAS al crear
        create: [
          'studentCareerEnrollmentId',
          'yearCycleID',
          'status',
          'registeredAt',
          'completedAt'
        ],

        // lo que ENVÍAS al actualizar (id va en la ruta)
        update: [
          'studentCareerEnrollmentId',
          'yearCycleID',
          'status',
          'registeredAt',
          'completedAt'
        ],

        // lo que USAS para tablas/listas
        table: [
          'id',
          'status',
          'registeredAt',
          'completedAt',
          'studentcareerenrollment',
          'yearcycle'
        ],

        delete: ['id']
      }
    });
  }
}
