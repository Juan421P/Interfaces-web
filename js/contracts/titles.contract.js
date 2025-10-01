import { Contract } from './../lib/contract.js';

export class DegreeTypeContract extends Contract{
	constructor(){
		super({
			schema:{
				id: Contract.types.string({
					required: true,
					default: ''
				}),
				universityID: Contract.types.string({
					required: true,
					default: ''
				}),
				degreeTypeName: Contract.types.string({
					required: true,
					default: '',
					regex: /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/
				}),
				universityName: Contract.types.string({
					required: true,
					default: ''
				}),
			},
			scopes: {
				create: [
					'universityID',
					'degreeTypeName',
					'universityName'
				],
				table: [
					'id',
					'universityID',
					'degreeTypeName',
					'universityName'
				],
				delete: [
					'id'
				],
				update: [
					'universityID',
					'degreeTypeName',
					'universityName'
				]
			}
		})
	}
}