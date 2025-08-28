import { makeContract } from './../lib/contract.js';

const { types: t } = makeContract({ schema: {} });

export const DegreeTypesContract = makeContract({
	schema: {
		id: t.string({
			required: false
		}),
		universityID: t.string({
			required: true
		}),
		degreeTypeName: t.string({
			required: true,
			min: 1,
			max: 120,
			trim: true
		}),
		universityName: t.string({
			required: false
		}),
	},
	scopes: {
		create: [
			'universityID',
			'degreeTypeName'
		],
		update: [
			'id',
			'universityID',
			'degreeTypeName'
		],
		table: [
			'id',
			'degreeTypeName',
			'universityName'
		],
	},
});
