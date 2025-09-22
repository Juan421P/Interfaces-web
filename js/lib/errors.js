const FIELD_LABELS = {
    email: 'correo',
    password: 'contraseña',
    username: 'usuario',
    name: 'nombre',
    role: 'rol',
};

const FEMININE_FIELDS = new Set(['contraseña', 'fecha', 'clave', 'dirección']);

function humanField(field) {
    return FIELD_LABELS[field] || field;
}

function translate(field, raw) {
    const f = humanField(field);
    const article = FEMININE_FIELDS.has(f) ? 'La' : 'El';
    const msg = (raw || '').toLowerCase();

    if (msg.includes('is required')) return `${article} ${f} es obligatori${FEMININE_FIELDS.has(f) ? 'a' : 'o'}`;
    if (msg.includes('must be a string')) return `${article} ${f} debe ser un texto válido`;
    if (msg.includes('format is invalid')) return `${article} ${f} no tiene un formato válido`;
    if (msg.includes('must be a number')) return `${article} ${f} debe ser un número`;
    if (msg.includes('must be a boolean')) return `${article} ${f} debe ser verdadero o falso`;
    if (msg.includes('must be a valid date') || msg.includes('invalid date')) return `La fecha de ${f} no es válida`;

    const num = msg.match(/\d+/)?.[0] || '';
    if (msg.includes('must be at least')) return `${article} ${f} debe tener al menos ${num} caracteres`;
    if (msg.includes('must be at most')) return `${article} ${f} no debe superar los ${num} caracteres`;
    if (msg.includes('must be >=')) return `${article} ${f} debe ser mayor o igual a ${num}`;
    if (msg.includes('must be <=')) return `${article} ${f} debe ser menor o igual a ${num}`;
    if (msg.includes('one of')) {
        const list = raw.split(':')[1]?.trim() || '';
        return `${article} ${f} debe ser uno de: ${list}`;
    }

    return `${article} ${f} ${raw}`.trim();
}


export function formatErrors(err) {
    const det = err?.details;

    if (det && typeof det === 'object' && !Array.isArray(det)) {
        return Object.entries(det).flatMap(([field, arr]) =>
            (arr || []).map(raw => translate(field, String(raw)))
        );
    }

    if (Array.isArray(det)) {
        return det.map(item => {
            if (typeof item === 'string') return translate('general', item);
            const field = item.field || item.param || 'general';
            const raw = item.msg || item.message || String(item);
            return translate(field, raw);
        });
    }

    if (typeof det === 'string') return [translate('general', det)];
    if (typeof err?.message === 'string') return [translate('general', err.message)];

    return ['Ocurrió un error inesperado'];
}
