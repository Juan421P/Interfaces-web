import { Contract } from './../lib/contract.js';

const SAFE_TEXT = /^[\w\s.,:/()\-#&@+]+$/i;

export class CourseEnrollmentContract extends Contract {
  constructor() {
    super({
      schema: {
        // PK
        id: Contract.types.string({
          required: false,     // el backend consulta existsById(id), lo enviamos si lo tenés
          trim: true,
          default: '',
          regex: SAFE_TEXT
        }),

        // FKs
        courseOfferingId: Contract.types.string({
          required: true,      // @NotNull en DTO (create)
          trim: true,
          min: 1,
          regex: SAFE_TEXT
        }),
        studentCareerEnrollmentId: Contract.types.string({
          required: true,      // @NotNull en DTO (create)
          trim: true,
          min: 1,
          regex: SAFE_TEXT
        }),

        // Campos de la inscripción
        enrollmentStatus: Contract.types.string({
          required: true,      // @NotBlank en DTO
          trim: true,
          min: 1,
          regex: SAFE_TEXT
        }),
        finalGrade: Contract.types.number({
          required: false,     // 0..100 (DTO usa DecimalMin/Max)
          min: 0,
          max: 100
        }),
        enrollmentDate: Contract.types.date({
          required: true       // @NotNull en DTO (LocalDate => 'YYYY-MM-DD')
        }),
        meritUnit: Contract.types.number({
          required: false
        }),

        // Derivados (solo lectura)
        courseOfferingName: Contract.types.string({
          required: false,
          trim: true,
          default: ''
        }),
        studentName: Contract.types.string({
          required: false,
          trim: true,
          default: ''
        }),
        careerName: Contract.types.string({
          required: false,
          trim: true,
          default: ''
        })
      },

      scopes: {
        // Lo que ENVÍAS al crear
        create: [
          'id',                          // opcional (si lo generás client-side)
          'courseOfferingId',
          'studentCareerEnrollmentId',
          'enrollmentStatus',
          'finalGrade',
          'enrollmentDate',
          'meritUnit'
        ],

        // Lo que ENVÍAS al actualizar (el id va en la ruta)
        update: [
          'courseOfferingId',
          'studentCareerEnrollmentId',
          'enrollmentStatus',
          'finalGrade',
          'enrollmentDate',
          'meritUnit'
        ],

        // Lo que usás para pintar tablas/listas
        table: [
          'id',
          'courseOfferingId',
          'studentCareerEnrollmentId',
          'courseOfferingName',
          'studentName',
          'careerName',
          'enrollmentStatus',
          'finalGrade',
          'enrollmentDate',
          'meritUnit'
        ],

        delete: ['id']
      }
    });
  }
}
