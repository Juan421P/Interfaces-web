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

export async function showImageModal(src) {
    const { Modal } = await import('./../../components/modal/modal.js');
    const modal = new Modal({ templateId: 'tmpl-image-preview', size: 'lg', hideCloseButton: true });
    await modal.open();
    modal.contentHost.querySelector('#modal-image-preview').src = src;
}