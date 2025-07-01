export function initializeFooter() {
    fetch('../components/footer.html').then(res => res.text()).then(html => {
        document.querySelector('#footer').outerHTML = html;
        requestAnimationFrame(() => {
            const newFooter = document.querySelector('#footer');
            if (!newFooter) {
                console.error('New #footer not found :(');
                return;
            }
            window.addEventListener('scroll', () => {
                const scrollY = window.scrollY;
                const visibleHeight = window.innerHeight;
                const pageHeight = document.documentElement.scrollHeight;
                if (scrollY + visibleHeight >= pageHeight - 1) {
                    newFooter.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-full');
                    newFooter.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
                } else {
                    newFooter.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
                    newFooter.classList.add('opacity-0', 'pointer-events-none', 'translate-y-full');
                }
            });
        });
    }).catch(error => console.error('#footer failed to load :(', error));
}