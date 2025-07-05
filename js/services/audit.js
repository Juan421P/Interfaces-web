export const AuditService = {

    async recent(userID, limit = 5) {
        return Array.from({ length: limit }).map((_, i) => ({
            operationAt: new Date(Date.now() - i * 1000 * 60 * 10).toISOString(),
            operationType: 'UPDATE',
            affectedTable: 'students',
            recordID: 1000 + i
        }));
    }

};
