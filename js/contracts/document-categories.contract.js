import { makeContract } from './../lib/contract.js';

const { types: t } = makeContract({ schema: {} });

export const DocumentCategoriesContract = makeContract({
	schema: {
		documentCategoryID: t.string({
			required: false
		}),
		universityID: t.string({
			required: true
		}),
		documentCategory: t.string({
			required: true,
			min: 1,
			max: 255,
			trim: true
		}),
		universityName: t.string({
			required: false
		}),
	},
	scopes: {
		create: [
			'universityID',
			'documentCategory'
		],
		update: [
			'documentCategoryID',
			'universityID',
			'documentCategory'
		],
		table: [
			'documentCategoryID',
			'documentCategory',
			'universityName'
		],
	},
});
