export async function init() {
    await renderAuditLog(1);
}

async function renderAuditLog(userID) {
    const container = document.querySelector('#audit-log');
    container.innerHTML = '';

    const audits = Array.from({ length: 5 }).map((_, i) => ({
        operationAt: new Date(Date.now() - i * 1000 * 60 * 10).toISOString(),
        operationType: 'UPDATE',
        affectedTable: 'students',
        recordID: 1000 + i
    }));

    audits.forEach(a => {
        const card = document.createElement('div');
        card.className = 'bg-gradient-to-tr from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] text-indigo-700 rounded-lg shadow p-4';
        card.innerHTML = `
            <p class="text-sm text-indigo-600">${a.operationType} en <span class="font-semibold">${a.affectedTable}</span></p>
            <p class="text-xs text-indigo-400">Registro #${a.recordID} • ${new Date(a.operationAt).toLocaleString()}</p>
        `;
        container.appendChild(card);
    });
}
