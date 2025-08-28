import { makeContract } from "../lib/contract";
const { types: t } = makeContract({ schema: {} });

export const CodeGenatorsContract = makeContract({
  schema: {
    generatorID: t.string({
      required: false
    }),
    entityTypeID: t.string({
      required: true
    }),
    correlativeID: t.string({
      required: true
    }),
    prefix: t.string({
      required: true, 
      min: 1,
      max: 15, 
      trim: true,
    }),
    suffixLength: t.int({
      required: true, 
      trim: true,
    }),
    lastAssignedNumber: t.int({
      required: true, 
      trim: true,
    }),
    entityTypeName: t.string({
      required: false,
      trim: true,
    }),
    facultyCorrelativesName: t.string({
      required: false, 
      trim: true,
    }),
    facultyCorrelativesID: t.number({
      required: false, 
      min: 0,
    })
  },
  scopes: {
    create: [
      'entityTypeID',
      'correlativeID',
      'prefix',
      'suffixLength',
      'lastAssignedNumber'
    ],
    update: [
      'entityTypeID',
      'correlativeID',
      'prefix',
      'suffixLength',
      'lastAssignedNumber'
    ],
    table: [
      'entityTypeName',
      'facultyCorrelativesName',
      'prefix',
      'suffixLength',
      'lastAssignedNumber'

    ],
  },
});
