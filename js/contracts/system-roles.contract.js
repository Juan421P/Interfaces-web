import { Contract } from './../lib/contract.js';

export class systemRolesContract extends Contract{
    constructor(){
        super({
            schema :{
                roleID: Contract.types.string({ 
                    required: true, 
                    default: '' 
                }), 
                roleName: Contract.types.string({ 
                    required: true, 
                    trim: true, 
                    min: 3, 
                    max: 50 
                })
            },
            scopes :{
                create: [ 
                    'roleName' 
                ], 
                update: [ 
                    'roleID', 
                    'roleName' 
                ], 
                table: [ 
                    'roleID', 
                    'roleName' 
                ],
                delete: [
                    'roleID'
                ]
            }
        });
    }
}