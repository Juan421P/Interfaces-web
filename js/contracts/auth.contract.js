import { Contract } from './../lib/contract.js';

export class AuthContract extends Contract {
	constructor() {
		super({
			schema: {
				email: Contract.types.string({
					required: true,
					trim: true,
					regex: /^[A-Za-z0-9.]+@[A-Za-z0-9.]+\.(?:[A-Za-z]{2,}|edu\.sv)$/,
					default: ""
				}),
				contrasena: Contract.types.string({
					required: true,
					min: 8,
					max: 256,
                    regex: /^[A-Za-z0-9#!@&]+$/,
					default: ""
				}),
				userID: Contract.types.string({
					required: true,
					trim: true,
					default: ""
				}),
				roleID: Contract.types.string({
					required: true,
					default: ""
				}),
				firstName: Contract.types.string({
					required: true,
					trim: true,
					default: ""
				}),
				lastName: Contract.types.string({
					required: true,
					trim: true,
					default: ""
				}),
				birthdate: Contract.types.string({
					required: false,
					default: ""
				}),
				contactEmail: Contract.types.string({
					required: false,
					trim: true,
					regex: /^[A-Za-z0-9.]+@[A-Za-z0-9.]+\.(?:[A-Za-z]{2,}|edu\.sv)$/,
					default: ""
				}),
				phone: Contract.types.string({
					required: false,
					trim: true,
					regex: /^[0-9+\- ]*$/,
					default: ""
				})
			},
			scopes: {
				login: [
					'email',
					'contrasena',
				], 
				me: [
					'userID',
					'email',
					'roleID',
					'firstName',
					'lastName',
					'birthdate',
					'contactEmail',
					'phone',	
				]
			}
		});
	}
}