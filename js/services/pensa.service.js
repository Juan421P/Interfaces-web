import { fetchJSON, postJSON, putJSON, deleteJSON } from "../lib/network";
import { PensaContract } from "../contracts/pensa.contract";

const ENDPOINT = "/Pensum";

export const PensaService = {
    contract: PensaContract,

    async list() {
        const pensa = await fetchJSON(`${ENDPOINT}/getPensa`);
        return Array.isArray(pensa)
            ? pensa.map(n => PensaContract.parse(n, "table"))
            : [];
    },

    async create(data) {
        const created = await postJSON(
            `${ENDPOINT}/newPensum`,
            PensaContract.parse(data, "create")
        );
        return PensaContract.parse(created.data, "table");
    },

    async update(id, data) {
        const updated = await putJSON(
            `${ENDPOINT}/updatePensum/${id}`,
            PensaContract.parse(data, "update")
        );
        return PensaContract.parse(updated, "table");
    },

    async delete(id) {
        const success = await deleteJSON(`${ENDPOINT}/deletePensum/${id}`);
        return success === true;
    }
};
