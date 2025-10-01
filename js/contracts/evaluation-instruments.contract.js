import { Contract } from "../lib/contract.js";

export class EvaluationInstrumentsContract extends Contract{
    constructor(){
        super({
            schema: {
                instrumentID: Contract.types.string({
                    required: true,
                    default: ''
                }),
                instrumentTypeID: Contract.types.string({
                    required: true,
                    default: ''
                }),
                description: Contract.types.string({
                    required: true,
                    default: ''
                }),
                usesRubric: Contract.types.string({
                    required: true,
                    default: ''
                }),
            },
            scopes: {
                create: [
                    'instrumentTypeID',
                    'description',
                    'usesRubric'
                ],
                table: [
                    'instrumentID',
                    'instrumentTypeID',
                    'description',
                    'usesRubric'
                ],
                delete: [
                    'instrumentID'
                ],
                update: [
                    'instrumentTypeID',
                    'description',
                    'usesRubric'
                ],
            }
        })
    }
}