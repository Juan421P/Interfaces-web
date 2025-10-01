import { Contract } from './../lib/contract.js'

export class DocumentsContract extends Contract{
    constructor(){
        super({
            schema:{
                documentID: Contract.types.string({
                    required: true,
                    default: ''
                }),
                documentCategoryID: Contract.types.string({
                    required: true,
                    default: ''
                }),
                documentName: Contract.types.string({
                    required: true,
                    default: ''
                }),
                documentCategory: Contract.types.string({
                    required: true,
                    default: ''
                }),
            },
            scopes: {
                create:[
                    'documentCategoryID',
                    'documentName',
                    'documentCategory'
                ],
                table: [
                    'documentID',
                    'documentCategoryID',
                    'documentName',
                    'documentCategory'
                ],
                delete: [
                    'documentID'
                ],
                update: [
                    'documentCategoryID',
                    'documentName',
                    'documentCategory'
                ]
            }
        })
    }
}