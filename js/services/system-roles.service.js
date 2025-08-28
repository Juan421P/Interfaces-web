import { fetchJSON, postJSON, putJSON } from './../lib/network.js';
import { systemRolesContract } from '../contracts/system-roles.contract.js'

const ENDPOINT = '/systemRoles';

export const systemRolesService ={
    contract: systemRolesContract,
    
    async list(){
        const systeRoles = await fetchJSON(
            `${ENDPOINT}/getSystemRoles`
        )
        const parsed = Array.isArray(systeRoles) ? systeRoles.map(n => systeRoles.parse(n, 'table')) : [];
                document.dispatchEvent(new CustomEvent('systemRoles:list', {
                    detail: parsed
                }));
                return parsed;
    },

    async create(data){
         const systeRoles = await postJSON(
                    `${ENDPOINT}/newRole`,
                    systeRoles.parse(data, 'create')
                );
                const parsed = systeRoles.parse(systeRoles, 'table');
                document.dispatchEvent(new CustomEvent('systemRoles:create', {
                    detail: parsed
                }));
                return parsed;
    },

     async update(data) {
            const systeRoles = await putJSON(
                `${ENDPOINT}/${data.roleID}`,
                systeRoles.parse(data, 'update')
            );
            const parsed = systeRoles.parse(s, 'table');
            document.dispatchEvent(new CustomEvent('systemRoles:update', { detail: parsed }));
            return parsed;
        },

        async delete(id) {
        const success = await deleteJSON(
            `${ENDPOINT}/deleteRoles/${id}`
        );
        document.dispatchEvent(new CustomEvent('systeRoles:delete', {
            detail: {
                id,
                success
            }
        }));
        return success === true;
    }
    
}