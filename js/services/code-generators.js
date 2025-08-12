export const CodeGeneratorsService = {
    async list() {
        return [
            { generatorID: 1, entityTypeID: 1, correlativeID: null, prefix: "JP", suffixLength: 3, lastAssignedNumber: 125 },
            { generatorID: 2, entityTypeID: 2, correlativeID: null, prefix: "EM", suffixLength: 3, lastAssignedNumber: 47 },
            { generatorID: 3, entityTypeID: 3, correlativeID: 201, prefix: "SDVLP", suffixLength: 3, lastAssignedNumber: 20 },
            { generatorID: 4, entityTypeID: 4, correlativeID: 202, prefix: "MAT", suffixLength: 3, lastAssignedNumber: 503 },
            { generatorID: 5, entityTypeID: 5, correlativeID: 203, prefix: "INF", suffixLength: 3, lastAssignedNumber: 708 },
            { generatorID: 6, entityTypeID: 6, correlativeID: null, prefix: "FAC", suffixLength: 2, lastAssignedNumber: 9 },
            { generatorID: 7, entityTypeID: 7, correlativeID: null, prefix: "DEP", suffixLength: 2, lastAssignedNumber: 18 },
            { generatorID: 8, entityTypeID: 8, correlativeID: 204, prefix: "LAB", suffixLength: 3, lastAssignedNumber: 4 },
            { generatorID: 9, entityTypeID: 9, correlativeID: null, prefix: "PRJ", suffixLength: 3, lastAssignedNumber: 2 },
            { generatorID: 10, entityTypeID: 10, correlativeID: 205, prefix: "CRS", suffixLength: 3, lastAssignedNumber: 310 }
        ];
    }
}