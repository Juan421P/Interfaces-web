import { Contract } from './../lib/contract.js';


export class UserContract extends Contract{
    constructor(){
        super({
            schema :{
                id: Contract.types.string({
                    required: true,
                    default: ''
                }),
                universityID: Contract.types.string({
                    required: true,
                    default: ''
                }),
                personId: Contract.types.string({
                    required: true,
                    default: ''
                }),
                roleId: Contract.types.string({
                    required: true,
                    default: ''
                }),
                email: Contract.types.string({
                    regex: /^[A-Za-z0-9.]+@[A-Za-z0-9.]+\.(?:[A-Za-z]{2,}|edu\.sv)$/,
                    required: true,

                }),
                contrasena: Contract.types.string({
                    required: true,
                    min: 8,
                    max: 15,
                    trim: true
                }),
                imageUrlUser: Contract.types.string({
                    required: true, 
                    trim: true, 
                    regex: /^(https?:\/\/[^\s/$.?#].[^\s]*)$/i, 
                    default: ''
                    
                }),
                rolesName: Contract.types.string({
                    required: true,
                    default: ''
                }),
                universityName: Contract.types.string({
                    required: true,
                    default: ''
                }),
                personName: Contract.types.string({
                    required: true,
                    default: ''
                }),
                personLastName: Contract.types.string({
                    required: true,
                    default: ''
                })
            },
            scopes :{
                create: [ 
                    'universityID', 
                    'personId', 
                    'roleId', 
                    'email', 
                    'contrasena', 
                    'imageUrlUser' ], 
                update: [ 
                    'id', 
                    'universityID', 
                    'personId', 
                    'roleId', 
                    'email', 
                    'contrasena', 
                    'imageUrlUser' 
                ], 
                table: [ 
                    'id', 
                    'email', 
                    'imageUrlUser', 
                    'rolesName', 
                    'universityName', 
                    'personName', 
                    'personLastName'
                ],
                delete: [
                    'id'
                ]
            }
        });
    }
}