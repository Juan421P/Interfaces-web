import { makeContract } from './../lib/contract.js';
const { types: t } = makeContract({ schema: {} });

export const systemRolesContract = makeContract({
    schema: {
        roleID:  t.string({
            required: false
        }),
        roleName: t.string({
			required: true
		}),
    },
    scopes: {
        create: [
            'roleName'
        ],
        update: [
            'roleID',
            'roleName'
        ],
        table: [
            'roleID',
            'roleName'
        ],
    },
});