import { Contract } from './../lib/contract.js';

export class FacultiesContract extends Contract {
	constructor() {
		super({
			schema: {
				facultyID: Contract.types.string({
					required: true,
					trim: true,
					default: ""
				}),
				facultyName: Contract.types.string({
					required: true,
					trim: true,
					regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/,
					max: 100,
					default: ""
				}),
				localityID: Contract.types.string({
					required: true,
					trim: true,
					default: ""
				})
			},
			scopes: {
				getAll: [
					'facultyID',
					'facultyName',
					'localityID'
				],
				create: [
					'facultyName',
					'localityID'
				],
				update: [
					'facultyID',
					'facultyName',
					'localityID'
				],
				delete: [
					'facultyID'
				]
			}
		});
	}
	
}