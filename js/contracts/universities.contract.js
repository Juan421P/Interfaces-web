import { Contract } from './../lib/contract.js';

export class UserContract extends Contract{
    constructor(){
        super({
            schema :{
                universityID: Contract.types.string({ 
                    required: true, 
                    default: '' 
                }),
                universityName: Contract.types.string({ 
                    required: true, 
                    trim: true, 
                    min: 3, 
                    max: 100 
                }), 
                rector: Contract.types.string({ 
                    required: true, 
                    trim: true, 
                    min: 3, 
                    max: 100 
                }), 
                webPage: Contract.types.string({ 
                    required: true, 
                    trim: true, 
                    regex: /^https?:\/\/.+$/i 
                }), 
                imageUrlUniversities: Contract.types.string({ 
                    required: false, 
                    trim: true, 
                    regex: /^(https?:\/\/[^\s/$.?#].[^\s]*)$/i, 
                    default: '' 
                })
            },
            scopes :{
                create: [ 'universityName', 'rector', 'webPage', 'imageUrlUniversities' ], 
                update: [ 'universityID', 'universityName', 'rector', 'webPage', 'imageUrlUniversities' ], 
                table: [ 'universityID', 'universityName', 'rector', 'webPage', 'imageUrlUniversities' ]

            }
        });
    }
}