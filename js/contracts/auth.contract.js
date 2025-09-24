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
			},
			scopes: {
				login: [
					'email',
					'contrasena',
				]
			}
		});
	}
}