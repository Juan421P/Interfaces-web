import { makeContract } from './../lib/contract.js';

const { types: t } = makeContract({ schema: {} });

export const SubjectFamiliesContract = makeContract({
	schema: {
		subjectFamilyID: t.string({
			required: false
		}),
		subjectPrefix: t.string({
			required: true,
			min: 1,
			max: 10,
			trim: true
		}),
		reservedSlots: t.number({
			required: true
		}),
		startingNumber: t.number({
			required: true
		}),
		lastAssignedNumber: t.number({
			required: true
		}),
		facultyID: t.string({
			required: true
		}),
		facultyName: t.string({
			required: false
		}),
	},
	scopes: {
		create: [
			'subjectPrefix',
			'reservedSlots',
			'startingNumber',
			'lastAssignedNumber',
			'facultyID'
		],
		update: [
			'subjectFamilyID',
			'subjectPrefix',
			'reservedSlots',
			'startingNumber',
			'lastAssignedNumber',
			'facultyID'
		],
		table: [
			'subjectFamilyID',
			'subjectPrefix',
			'reservedSlots',
			'startingNumber',
			'lastAssignedNumber',
			'facultyName'
		],
	},
});
