    import { StringPipe } from './../pipes/string.pipe.js';
    import { NumberPipe } from './../pipes/number.pipe.js';
    import { BooleanPipe } from './../pipes/boolean.pipe.js';
    import { DatePipe } from './../pipes/date.pipe.js';
    import { TimestampPipe } from '../pipes/timestamp.pipe.js';

    export class PipeManager {
        static pipes = {
            string: StringPipe,
            number: NumberPipe,
            boolean: BooleanPipe,
            date: DatePipe,
            timestamp: TimestampPipe
        };

        static humanize(value, type, options = {}) {
            const pipe = this.pipes[type];
            if (!pipe) {
                console.warn(`No pipe found for type: ${type}`);
                return value;
            }

            return pipe.humanize(value, options);
        }

        static normalize(value, type, options = {}) {
            const pipe = this.pipes[type];
            if (!pipe) {
                console.warn(`No pipe found for type: ${type}`);
                return value;
            }

            return pipe.normalize(value, options);
        }

        static humanizeObject(obj, schema, options = {}) {
            const result = {};

            for (const [key, fieldSchema] of Object.entries(schema)) {
                if (obj[key] !== undefined) {
                    const fieldOptions = { ...fieldSchema, ...options[key] };
                    result[key] = this.humanize(obj[key], fieldSchema.type, fieldOptions);
                }
            }

            return result;
        }

        static normalizeObject(obj, schema, options = {}) {
            const result = {};

            for (const [key, fieldSchema] of Object.entries(schema)) {
                if (obj[key] !== undefined) {
                    const fieldOptions = { ...fieldSchema, ...options[key] };
                    result[key] = this.normalize(obj[key], fieldSchema.type, fieldOptions);
                }
            }

            return result;
        }
    }