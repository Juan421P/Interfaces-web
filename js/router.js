// import { ROUTES } from './routes.js';

// export async function loadViewFromHash() {
//     const hash = location.hash || '#main';
//     const view = Object.values(ROUTES.views).find(v => v.hash === hash);
//     if (!view) {
//         console.error(`No view matched hash "${hash}"`);
//         return;
//     }
//     try {
//         const res = await fetch(view.file);
//         const html = await res.text();
//         const main = document.querySelector('main');
//         if (!main) throw new Error('<main> element not found in DOM');
//         main.innerHTML = html;
//         const fileName = view.hash.slice(1);
//         try {
//             const module = await import(`../pages/${fileName}.js`);
//             if (module?.init) module.init();
//         } catch (error) {
//             console.warn(`No JS module found for view "${fileName} :("`);
//         }
//         document.title = view.title;
//     } catch (error) {
//         console.error(`Failed to load view "${view.hash}" :(`, err);
//     }
// }