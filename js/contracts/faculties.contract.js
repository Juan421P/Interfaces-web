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
				facultyCode: Contract.types.string({
					required: true,
					trim: true,
					max: 20,
				}),
				contactPhone: Contract.types.string({
					required: true,
					trim: true,
					regex: /^\+503\s\d{4}-\d{4}$/,
				}),
				correlativeCode: Contract.types.string({
					required: true
				})
				
			},
			scopes: {
				getAll: [
					'facultyID',
					'facultyName',
					'facultyCode',
					'contactPhone',
					'correlativeCode'
				],
				create: [
					'facultyName',
					'facultyCode',
					'contactPhone',
					'correlativeCode'
				],
				update: [
					'facultyID',
					'facultyName',
					'facultyCode',
					'contactPhone',
					'correlativeCode'
				],
				delete: [
					'facultyID'
				]
			}
		});
	}
	
}