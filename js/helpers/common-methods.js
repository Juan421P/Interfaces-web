export function buildInitials(text, size = 7) {
    const element = document.createElement('div');
    element.className = `h-${size} w-${size} rounded-full bg-gradient-to-tr from-indigo-100 to-blue-100 flex items-center justify-center drop-shadow text-xs font-bold text-indigo-400 select-none`;
    element.textContent = text;
    return element;
}