import { Contract } from './../lib/contract.js';

const SAFE_TEXT = /^[\w\s.,:/()\-#&@+]+$/i;

export class CyclicStudentPerformanceContract extends Contract {
  constructor() {
    super({
      schema: {
        // IDs
        performanceID: Contract.types.string({
          required: false,     // requerido SOLO en create (ver scope)
          trim: true,
          min: 1,
          default: '',
          regex: SAFE_TEXT
        }),

        studentCycleEnrollmentID: Contract.types.string({
          required: false,     // requerido en create/update (ver scopes)
          trim: true,
          min: 1,
          default: '',
          regex: SAFE_TEXT
        }),

        // Métricas
        totalValueUnits: Contract.types.number({
          required: false
        }),
        totalMeritUnit: Contract.types.number({
          required: false
        }),
        meritUnitCoefficient: Contract.types.number({
          required: false
        }),

        // Fechas (LocalDate en backend => acepta 'YYYY-MM-DD')
        computedAt: Contract.types.date({
          required: false
        }),

        // Derivados (solo lectura)
        studentID: Contract.types.string({
          required: false,
          trim: true,
          default: ''
        }),
        studentName: Contract.types.string({
          required: false,
          trim: true,
          default: ''
        }),
        careerID: Contract.types.string({
          required: false,
          trim: true,
          default: ''
        }),
        careerName: Contract.types.string({
          required: false,
          trim: true,
          default: ''
        }),

        // Campo tal cual viene en el DTO (ojo mayúscula inicial)
        StudentCycleEnrollment: Contract.types.string({
          required: false,
          trim: true,
          default: ''
        })
      },

      scopes: {
        // Lo que ENVÍAS al crear
        create: [
          'performanceID',            // el backend valida existencia por ID -> requerido aquí
          'studentCycleEnrollmentID', // requerido
          'totalValueUnits',
          'totalMeritUnit',
          'meritUnitCoefficient',
          'computedAt'
        ],

        // Lo que ENVÍAS al actualizar (id va en la ruta)
        update: [
          'studentCycleEnrollmentID', // si lo envías, el backend lo reasigna
          'totalValueUnits',
          'totalMeritUnit',
          'meritUnitCoefficient',
          'computedAt'
        ],

        // Lo que USAS para tablas/listas
        table: [
          'performanceID',
          'studentCycleEnrollmentID',
          'totalValueUnits',
          'totalMeritUnit',
          'meritUnitCoefficient',
          'computedAt',
          'studentID',
          'studentName',
          'careerID',
          'careerName',
          'StudentCycleEnrollment'
        ],

        delete: ['performanceID']
      }
    });
  }
}
