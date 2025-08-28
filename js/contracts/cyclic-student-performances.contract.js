import { makeContract } from './../lib/contract.js';

const { types: t } = makeContract({ schema: {} });

export const CyclicStudentPerformanceContract = makeContract({
	schema: {
		performanceID: t.string({
			required: false,
		}),
		studentCycleEnrollmentID: t.string({
			required: true,
		}),
		totalValueUnits: t.number({
			required: true,
		}),
		totalMeritUnit: t.number({
			required: true,
		}),
		meritUnitCoefficient: t.number({
			required: true,
		}),
		computedAt: t.date({
			required: true,
			coerce: true, // para transformar strings como: "2025-08-27" 
		}),
		studentID: t.string({
			required: false,
		}),
		careerID: t.string({
			required: false,
		}),
        studentName: t.string({
			required: false,
		}),
		careerName: t.string({
			required: false,
		}),
		studentCycleEnrollment: t.string({
			required: false,
		}),
	},
	scopes: {
		create: [
			'studentCycleEnrollmentID',
			'totalValueUnits',
			'totalMeritUnit',
			'meritUnitCoefficient',
			'computedAt',
		],
		update: [
			'performanceID',
			'totalValueUnits',
			'totalMeritUnit',
			'meritUnitCoefficient',
			'computedAt',
		],
		table: [
			'performanceID',
			'studentName',
			'careerName',
			'totalValueUnits',
			'totalMeritUnit',
			'meritUnitCoefficient',
			'computedAt',
		],
	},
});
