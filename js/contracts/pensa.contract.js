import { Contract } from './../lib/contract.js';

export class PensaContract extends Contract {
    constructor() {
        super({
            schema: {
                PensumID: Contract.types.string({
                    required: false
                }),
                CareerID: Contract.types.string({
                    required: true
                }),
                Version: Contract.types.string({
                    required: true,
                    min: 1,
                    max: 20
                }),
                EffectiveYear: Contract.types.number({
                    required: true,
                    regex: /^(19|20)\d{2}$/
                }),
                career: Contract.types.string({
                    required: false
                }),
            },
            scopes: {
                table: [
                    'PensumID',
                    'CareerID',
                    'Version',
                    'EffectiveYear',
                    'career'
                ],
                create: [
                    'CareerID',
                    'Version',
                    'EffectiveYear'
                ],
                update: [
                    'CareerID',
                    'Version',
                    'EffectiveYear'
                ],
                delete: [
                    'CareerID'
                ]
            }
        });
    }
}