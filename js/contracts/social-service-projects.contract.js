import { Contract } from "../lib/contract.js";

export class SocialServiceContract extends Contract{
    constructor(){
        super({
            schema:{
                socialServiceProjectID: Contract.types.string({
                    required: true,
                    default: ''
                }),
                universityID: Contract.types.string({
                    required: true,
                    default: ''
                }),
                socialServiceProjectName: Contract.types.string({
                    required: true,
                    default: ''
                }),
                description: Contract.types.string({
                    required: true,
                    default: ''
                }),
                universityName: Contract.types.string({
                    required: true,
                    default: ''
                }),
            },
            scopes:{
                create: [
                    'universityID',
                    'socialServiceProjectName',
                    'description',
                    'universityName'
                ],
                table: [
                    'socialServiceProjectID',
                    'universityID',
                    'socialServiceProjectName',
                    'description',
                    'universityName'
                ],
                delete: [
                    'socialServiceProjectID'
                ],
                update: [
                    'universityID',
                    'socialServiceProjectName',
                    'description',
                    'universityName'
                ]
            }
        })
    }
}