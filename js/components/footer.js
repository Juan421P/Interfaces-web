export function initializeFooter() {
    fetch('components/footer.html').then(res => res.text()).then(html => document.querySelector('#footer').innerHTML = html);
    const footer = document.querySelector('#footer');
    footer.classList.add('fixed', 'bottom-0', 'left-0', 'w-full', 'bg-indigo-400', 'z-50',
        'opacity-0', 'pointer-events-none', 'translate-y-full',
        'transition-all', 'duration-700', 'ease-in-out', 'grid', 'grid-cols-12');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const visibleHeight = window.innerHeight;
        const pageHeight = document.documentElement.scrollHeight;
        if (scrollY + visibleHeight >= pageHeight - 10) {
            footer.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-full');
            footer.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
        } else {
            footer.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
            footer.classList.add('opacity-0', 'pointer-events-none', 'translate-y-full');
        }
    });
}