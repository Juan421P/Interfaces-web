import { fetchJSON, postJSON, putJSON, deleteJSON } from './../lib/network.js';
import { EmployeesContract } from './../contracts/employees.contract.js';

const ENDPOINT = '/Employees';

export const EmployeesService = {
    contract: EmployeesContract,

    async list() {
        const employees = await fetchJSON(
            `${ENDPOINT}/getEmployees`
        );
        const parsed = Array.isArray(employees) ? employees.map(e => EmployeesContract.parse(e, 'table')) : [];
        document.dispatchEvent(new CustomEvent('Employees:list', {
            detail: parsed
        }));
        return parsed;
    },

    async create(data) {
        const employee = await postJSON(
            `${ENDPOINT}/newEmployee`,
            EmployeesContract.parse(data, 'create')
        );
        const parsed = EmployeesContract.parse(employee, 'table');
        document.dispatchEvent(new CustomEvent('Employees:create', {
            detail: parsed
        }));
        return parsed;
    },

    async update(data) {
        const employee = await putJSON(
            `${ENDPOINT}/${data.employeeID}`,
            EmployeesContract.parse(data, 'update')
        );
        const parsed = EmployeesContract.parse(employee, 'table');
        document.dispatchEvent(new CustomEvent('Employees:update', { detail: parsed }));
        return parsed;
    },

    async delete(id) {
        const success = await deleteJSON(
            `${ENDPOINT}/deleteEmployee/${id}`
        );
        document.dispatchEvent(new CustomEvent('Employees:delete', {
            detail: {
                id,
                success
            }
        }));
        return success === true;
    }
};