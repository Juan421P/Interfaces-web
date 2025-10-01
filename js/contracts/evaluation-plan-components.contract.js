import { Contract } from './../lib/contract.js';

const SAFE_TEXT = /^[\w\s.,:/()\-#&@+]+$/i;

export class EvaluationPlanComponentsContract extends Contract {
  constructor() {
    super({
      schema: {
        // PK
        componentID: Contract.types.string({
          required: false,
          trim: true,
          default: ''
        }),

        // FK
        evaluationPlanID: Contract.types.string({
          required: true,           // @NotNull
          trim: true,
          min: 1,
          regex: SAFE_TEXT
        }),

        // Campos
        rubric: Contract.types.string({
          required: false,
          trim: true,
          max: 100,                 // @Size(max=100)
          default: ''
        }),
        componentName: Contract.types.string({
          required: true,           // @NotBlank, @Size(4..80)
          trim: true,
          min: 4,
          max: 80,
          regex: SAFE_TEXT
        }),
        weightPercentage: Contract.types.number({
          required: true,           // @NotNull, 0.01..100.00
          min: 0.01,
          max: 100
        }),
        orderIndex: Contract.types.number({
          required: false,
          min: 1,                   // servicio backend valida >= 1
          default: 1
        }),

        // Derivado (solo lectura)
        evaluationplans: Contract.types.string({
          required: false,
          trim: true,
          default: ''
        })
      },

      scopes: {
        // Lo que ENVÍAS al crear
        create: [
          'evaluationPlanID',
          'rubric',
          'componentName',
          'weightPercentage',
          'orderIndex'
        ],

        // Lo que ENVÍAS al actualizar (id va en la ruta)
        update: [
          'evaluationPlanID',
          'rubric',
          'componentName',
          'weightPercentage',
          'orderIndex'
        ],

        // Lo que usas para tablas/listas
        table: [
          'componentID',
          'evaluationPlanID',
          'componentName',
          'rubric',
          'weightPercentage',
          'orderIndex',
          'evaluationplans'
        ],

        delete: ['componentID']
      }
    });
  }
}
