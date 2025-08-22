export function buildInitials(text, size = 7) {
    const element = document.createElement('div');
    element.className = `h-${size} w-${size} rounded-full bg-gradient-to-tr from-indigo-100 to-blue-100 flex items-center justify-center drop-shadow text-xs font-bold text-indigo-400 select-none`;
    element.textContent = text;
    return element;
}

/**
*   Remove every <script> element from a HTML string or template.
*   @param {string|DocumentFragment} htmlOrFragment
*   @returns {HTMLTemplateElement} template with scripts stripped
*/
export function stripScripts(htmlOrFragment) {
    const tpl = document.createElement('template');
    if (typeof htmlOrFragment === 'string') {
        tpl.innerHTML = htmlOrFragment.trim();
    } else {
        tpl.content.append(htmlOrFragment.cloneNode(true));
    }
    tpl.content.querySelectorAll('script').forEach(s => s.remove());
    return tpl;
}

export function extractTemplateContent(html) {
    const tpl = stripScripts(html);

    const nestedTemplate = tpl.content.querySelector('template');
    if (nestedTemplate) {
        return nestedTemplate.content;
    }

    const form = tpl.content.querySelector('form');
    if (form) {
        const fragment = new DocumentFragment();
        fragment.appendChild(form.cloneNode(true));
        return fragment;
    }

    return tpl.content;
}

export async function showImageModal(src) {
    const { Modal } = await import('../../components/modal/modal.js');
    const modal = new Modal({ templateId: 'tmpl-image-preview', size: 'lg', hideCloseButton: true });
    modal.contentHost.querySelector('#modal-image-preview').src = src;
}

export function leftJOIN(mainData, joins) {
    const joinMaps = joins.map(join => ({
        ...join,
        map: new Map(join.data.map(item => [
            item[join.referenceKey || 'id'],
            item
        ]))
    }));

    return mainData.map(mainItem => {
        const result = { ...mainItem };
        joinMaps.forEach(({ map, foreignKey, alias, fields }) => {
            const relatedItem = map.get(mainItem[foreignKey]);
            result[alias] = relatedItem
                ? _pickFields(relatedItem, fields)
                : null;
        });
        return result;
    });
}

export function rightJOIN(mainData, joins) {
    if (joins.length === 0) return [];

    const { data, foreignKey, alias, fields, referenceKey } = joins[0];
    const mainDataMap = new Map(mainData.map(item => [
        item[foreignKey],
        item
    ]));

    return data.map(joinItem => {
        const joinKey = joinItem[referenceKey || 'id'];
        const mainItem = mainDataMap.get(joinKey);
        return {
            ..._pickFields(joinItem, fields === '*' ? Object.keys(joinItem) : fields),
            [alias]: mainItem ? { ...mainItem } : null
        };
    });
}

export function innerJOIN(mainData, joins) {
    const joinMaps = joins.map(join => ({
        ...join,
        map: new Map(join.data.map(item => [
            item[join.referenceKey || 'id'],
            item
        ]))
    }));

    return mainData.filter(mainItem => {
        return joinMaps.every(({ map, foreignKey }) =>
            map.has(mainItem[foreignKey])
        );
    }).map(mainItem => {
        const result = { ...mainItem };
        joinMaps.forEach(({ map, foreignKey, alias, fields }) => {
            result[alias] = _pickFields(map.get(mainItem[foreignKey]), fields);
        });
        return result;
    });
}

function _pickFields(obj, fields) {
    if (!obj) return null;
    if (fields === '*') return { ...obj };
    return fields.reduce((acc, field) => {
        if (obj.hasOwnProperty(field)) {
            acc[field] = obj[field];
        }
        return acc;
    }, {});
}