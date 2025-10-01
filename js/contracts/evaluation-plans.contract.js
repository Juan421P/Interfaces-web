// contracts/evaluation-plans.contract.js
import { Contract } from './../lib/contract.js';

const SAFE_TEXT = /^[\w\s.,:/()\-#&@+]+$/i;

export class EvaluationPlansContract extends Contract {
  constructor() {
    super({
      schema: {
        evaluationPlanID: Contract.types.string({
          required: false,
          trim: true,
          default: ''
        }),

        // FKs
        courseOfferingID: Contract.types.string({
          // @NotNull/@NotBlank en backend → requerido en create/update
          required: true,
          trim: true,
          min: 1,
          default: '',
          regex: SAFE_TEXT
        }),

        // Datos del plan
        planName: Contract.types.string({
          // @NotNull/@NotBlank y @Size(4..80)
          required: true,
          trim: true,
          min: 4,
          max: 80,
          default: '',
          regex: SAFE_TEXT
        }),

        description: Contract.types.string({
          // @Size(max=200)
          required: false,
          trim: true,
          max: 200,
          default: '',
          regex: SAFE_TEXT
        }),

        createdAt: Contract.types.date({
          required: false
        }),

        // Derivado que viene en DTO (cuando no hay courseOffering asignado)
        courseoffering: Contract.types.string({
          required: false,
          trim: true,
          default: ''
        })
      },

      scopes: {
        // Lo que ENVÍAS al crear
        create: [
          'courseOfferingID',
          'planName',
          'description',
          'createdAt'
        ],

        // Lo que ENVÍAS al actualizar (ID va en la ruta)
        update: [
          'courseOfferingID',
          'planName',
          'description',
          'createdAt'
        ],

        // Lo que usas para listas/tablas en UI
        table: [
          'evaluationPlanID',
          'courseOfferingID',
          'planName',
          'description',
          'createdAt',
          'courseoffering'
        ],

        delete: ['evaluationPlanID']
      }
    });
  }
}
