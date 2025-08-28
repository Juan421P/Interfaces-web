import { makeContract } from './../lib/contract.js';

const { types: t } = makeContract({ schema: {} });

export const EmployeesContract = makeContract({
    schema: {
        employeeID: t.string({
            required: false
        }),
        personID: t.string({
            required: true
        }),
        departmentID: t.string({
            required: true
        }),
        employeeCode: t.string({
            required: true,
            trim: true
        }),
        employeeDetail: t.string({
            required: true,
            trim: true
        }),
    },
    scopes: {
        create: [
            'personID',
            'departmentID',
            'employeeCode',
            'employeeDetail'
        ],
        update: [
            'employeeID',
            'personID',
            'departmentID',
            'employeeCode',
            'employeeDetail'
        ],
        table: [
            'employeeID',
            'personID',
            'departmentID',
            'employeeCode',
            'employeeDetail'
        ],
    },
});
