import { makeContract } from './../lib/contract.js';

const { types: t } = makeContract({ schema: {} });

export const SubjectTeachersContract = makeContract({
	schema: {
		subjectTeacherID: t.string({
			required: false
		}),
		subjectID: t.string({
			required: true
		}),
		employeeID: t.string({
			required: true
		}),
		subject: t.string({
			required: false
		}),
		employee: t.string({
			required: false
		}),
	},
	scopes: {
		create: [
			'subjectID',
			'employeeID'
		],
		update: [
			'subjectTeacherID',
			'subjectID',
			'employeeID'
		],
		table: [
			'subjectTeacherID',
			'subject',
			'employee'
		],
	},
});
