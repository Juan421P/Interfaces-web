export class Navbar {
    constructor(opts = {}) {
        this.url = opts.url || './components/navbar/navbar.html';
    }

    async load() {
        const res = await fetch(this.url);
        const htmlText = await res.text();

        const tpl = document.createElement('template');
        tpl.innerHTML = htmlText.trim();

        if (window.currentUserPerms) filterByPerm(tpl.content, window.currentUserPerms);

        const host = document.querySelector('#navbar');
        host.innerHTML = '';
        host.append(tpl.content.cloneNode(true));

        this.attachCollapses();
        this.highlightActive();
        window.addEventListener('hashchange', () => this.highlightActive());
    }

    highlightActive() {
        const hash = window.location.hash || '#main';

        document.querySelectorAll('#sidebar .nav-btn').forEach(entry => {
            entry.classList.remove('bg-white', 'shadow-lg');
            const inner = entry.querySelector('.inner');
            inner?.classList.remove('bg-gradient-to-r', 'from-indigo-400', 'to-blue-400');

            entry.querySelectorAll('svg').forEach(s => s.classList.remove('text-white'));
            const sp = entry.querySelector('span');
            sp?.classList.remove('text-white');
            sp?.classList.add('text-indigo-400');
        });

        let entry = document.querySelector(`#sidebar [data-hash="${hash}"]`)?.closest('.nav-btn')
            || document.querySelector(`#sidebar a[href="${hash}"]`)?.closest('.nav-btn');
        if (!entry) return;

        entry.classList.add('bg-white', 'shadow-lg');
        const inner = entry.querySelector('.inner');
        inner?.classList.add('bg-gradient-to-r', 'from-indigo-400', 'to-blue-400');

        entry.querySelectorAll('svg').forEach(s => {
            s.classList.remove('text-indigo-400');
            s.classList.add('text-white');
        });

        const sp = entry.querySelector('span');
        if (sp) {
            sp.classList.remove('text-indigo-400');
            sp.classList.add('text-white');
        }
    }



    attachCollapses() {
        document.querySelectorAll('[data-toggle="collapse"]').forEach(btn => {
            const target = document.querySelector(btn.dataset.target);
            btn.addEventListener('click', () => {
                target.classList.toggle('hidden');
                btn.querySelector('svg:last-child')?.classList.toggle('rotate-180');
            });
        });
    }
}

function filterByPerm(root, allowed = []) {
    root.querySelectorAll('[data-perm]').forEach(node => {
        if (!allowed.includes(node.dataset.perm)) node.remove();
    });
}
