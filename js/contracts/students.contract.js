import { Contract } from "../lib/contract.js";

export class StudentContract extends Contract{
    constructor(){
        super({
            schema:{
                studentID: Contract.types.string({
                    required: true,
                    default: ''
                }),
                personID: Contract.types.string({
                    required: true,
                    default: ''
                }),
                studentCode: Contract.types.string({
                    required: true,
                    default: ''
                }),
                personName: Contract.types.string({
                    required: true,
                    default: '',
                    regex: /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/
                }),
                personLastName: Contract.types.string({
                    required: true,
                    default: '',
                    regex: /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/
                }),
                careerId: Contract.types.string({
                    required: true,
                    default: ''
                }),
                yearCycleId: Contract.types.string({
                    required: true,
                    default: ''
                }),
                careerEnrollmentID: Contract.types.string({
                    required: true,
                    default: ''
                }),
                cycleEnrollmentID: Contract.types.string({
                    required: true,
                    default: ''
                }),
                performanceID: Contract.types.string({
                    required: true,
                    default: ''
                }),
            },
            scopes:{
                create: [
                    'personID',
                    'studentCode',
                    'personLastName',
                    'careerId',
                    'yearCycleId',
                    'careerEnrollmentID',
                    'cycleEnrollmentID',
                    'performanceID'
                ],
                table: [
                    'studentID',
                    'personID',
                    'studentCode',
                    'personLastName',
                    'careerId',
                    'yearCycleId',
                    'careerEnrollmentID',
                    'cycleEnrollmentID',
                    'performanceID'
                ],
                delete: [
                    'studentID'
                ],
                update: [
                    'personID',
                    'studentCode',
                    'personLastName',
                    'careerId',
                    'yearCycleId',
                    'careerEnrollmentID',
                    'cycleEnrollmentID',
                    'performanceID'
                ]
            }
        })
    }
}