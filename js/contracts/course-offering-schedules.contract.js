import { makeContract } from "../lib/contract";
const { types: t } = makeContract({ schema: {} });

export const CourseOfferingSchedulesContract = makeContract({
  schema: {
    id: t.string({
      required: false,
    }),
    courseOfferingID: t.string({
      required: true,
    }),
    weekday: t.number({
      required: true,
      min: 1,
      max: 7,
    }),
    startTime: t.string({
      required: true,
      pattern: /^(?:[01][0-9]|2[0-3]):[0-5][0-9]$/,
      trim: true,
    }),
    endTime: t.string({
      required: true,
      pattern: /^(?:[01][0-9]|2[0-3]):[0-5][0-9]$/,
      trim: true,
    }),
    classroom: t.string({
      required: false,
      max: 40,
      trim: true,
    }),
    courseOffering: t.string({
      required: false,
      trim: true,
    }),
  },
  scopes: {
    create: [
      "courseOfferingID",
      "weekday",
      "startTime",
      "endTime",
      "classroom",
    ],
    update: [
      "weekday",
      "startTime",
      "endTime",
      "classroom",
    ],
    table: [
      "weekday",
      "startTime",
      "endTime",
      "classroom",
      "courseOffering",
    ],
  },
});
