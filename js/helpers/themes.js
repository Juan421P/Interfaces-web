export const THEMES = (() => {
    const toKebab = (s) => s.replace(/([A-Z])/g, '-$1').toLowerCase();

    const palettes = [
        {
            name: 'indigo-blue',
            light: {
                bodyFrom: '224, 231, 255',       // indigo-100
                bodyTo: '219, 234, 254',         // blue-100
                cardFrom: '238, 242, 255',       // indigo-50
                cardTo: '239, 246, 255',         // blue-50
                textFrom: '129, 140, 248',       // indigo-400
                textTo: '96, 165, 250',          // blue-400
                buttonFrom: '129, 140, 248',     // indigo-400
                buttonTo: '96, 165, 250',        // blue-400
                buttonText: '255, 255, 255',     // white
                placeholderFrom: '165, 180, 252',// indigo-300
                placeholderTo: '147, 197, 253'   // blue-300
            },
            dark: {
                bodyFrom: '38, 38, 38',          // neutral-800
                bodyTo: '64, 64, 64',            // neutral-700
                cardFrom: '31, 31, 31',          // neutral-900
                cardTo: '38, 38, 38',            // neutral-800
                textFrom: '229, 231, 235',       // gray-200
                textTo: '209, 213, 219',         // gray-300
                buttonFrom: '99, 102, 241',      // indigo-500
                buttonTo: '59, 130, 246',        // blue-500
                buttonText: '255, 255, 255',
                placeholderFrom: '165, 180, 252',
                placeholderTo: '147, 197, 253'
            }
        },

        {
            name: 'green-lime',
            light: {
                bodyFrom: '240, 253, 244',       // green-50
                bodyTo: '247, 254, 231',         // lime-50
                cardFrom: '245, 252, 245',
                cardTo: '252, 255, 231',
                textFrom: '34, 197, 94',         // green-500
                textTo: '132, 204, 22',          // lime-500
                buttonFrom: '34, 197, 94',
                buttonTo: '132, 204, 22',
                buttonText: '255, 255, 255',
                placeholderFrom: '134, 239, 172', // green-300 (approx)
                placeholderTo: '190, 242, 112'    // lime-300 (approx)
            },
            dark: {
                bodyFrom: '30, 30, 30',
                bodyTo: '50, 50, 50',
                cardFrom: '22, 22, 22',
                cardTo: '30, 30, 30',
                textFrom: '229, 231, 235',
                textTo: '209, 213, 219',
                buttonFrom: '21, 128, 61',       // green-600
                buttonTo: '101, 163, 13',        // lime-600
                buttonText: '255, 255, 255',
                placeholderFrom: '134, 239, 172',
                placeholderTo: '190, 242, 112'
            }
        },

        {
            name: 'red-orange',
            light: {
                bodyFrom: '255, 241, 241',       // red-50
                bodyTo: '255, 247, 237',         // orange-50
                cardFrom: '255, 245, 245',
                cardTo: '255, 249, 240',
                textFrom: '248, 113, 113',       // red-400
                textTo: '249, 115, 22',          // orange-500
                buttonFrom: '248, 113, 113',
                buttonTo: '249, 115, 22',
                buttonText: '255, 255, 255',
                placeholderFrom: '252, 165, 165', // red-300
                placeholderTo: '253, 186, 116'    // orange-300
            },
            dark: {
                bodyFrom: '32, 32, 32',
                bodyTo: '54, 54, 54',
                cardFrom: '20, 20, 20',
                cardTo: '30, 30, 30',
                textFrom: '229, 231, 235',
                textTo: '209, 213, 219',
                buttonFrom: '220, 38, 38',       // red-600
                buttonTo: '234, 88, 12',         // orange-600
                buttonText: '255, 255, 255',
                placeholderFrom: '252, 165, 165',
                placeholderTo: '253, 186, 116'
            }
        },

        {
            name: 'teal-yellow',
            light: {
                bodyFrom: '236, 254, 250',       // teal-50 (approx)
                bodyTo: '255, 251, 235',         // yellow-50
                cardFrom: '245, 254, 251',
                cardTo: '255, 253, 236',
                textFrom: '20, 184, 166',        // teal-500
                textTo: '234, 179, 8',           // yellow-500
                buttonFrom: '20, 184, 166',
                buttonTo: '234, 179, 8',
                buttonText: '255, 255, 255',
                placeholderFrom: '99, 211, 199',  // teal-300 (approx)
                placeholderTo: '253, 224, 71'     // yellow-300
            },
            dark: {
                bodyFrom: '34, 34, 34',
                bodyTo: '60, 60, 60',
                cardFrom: '28, 28, 28',
                cardTo: '34, 34, 34',
                textFrom: '229, 231, 235',
                textTo: '209, 213, 219',
                buttonFrom: '15, 118, 110',      // teal-600
                buttonTo: '202, 138, 4',         // yellow-600
                buttonText: '255, 255, 255',
                placeholderFrom: '99, 211, 199',
                placeholderTo: '253, 224, 71'
            }
        },

        {
            name: 'blue-cyan',
            light: {
                bodyFrom: '239, 246, 255',       // blue-50-ish
                bodyTo: '236, 254, 255',         // cyan-50-ish
                cardFrom: '243, 248, 255',
                cardTo: '240, 254, 255',
                textFrom: '96, 165, 250',        // blue-400
                textTo: '34, 211, 238',          // cyan-400 (approx)
                buttonFrom: '96, 165, 250',
                buttonTo: '34, 211, 238',
                buttonText: '255, 255, 255',
                placeholderFrom: '147, 197, 253', // blue-300
                placeholderTo: '125, 211, 252'    // cyan-300
            },
            dark: {
                bodyFrom: '30, 30, 30',
                bodyTo: '58, 58, 58',
                cardFrom: '20, 20, 20',
                cardTo: '30, 30, 30',
                textFrom: '229, 231, 235',
                textTo: '209, 213, 219',
                buttonFrom: '59, 130, 246',      // blue-500
                buttonTo: '6, 182, 212',         // cyan-ish
                buttonText: '255, 255, 255',
                placeholderFrom: '147, 197, 253',
                placeholderTo: '125, 211, 252'
            }
        }
    ];

    const STORAGE_KEY = 'app_theme_v1';

    let current = { palette: palettes[0].name, mode: 'light' };

    function applyPalette(paletteName, mode = 'light') {
        const palette = palettes.find(p => p.name === paletteName);
        if (!palette) {
            console.error('[THEME] palette not found:', paletteName);
            return false;
        }
        const vars = palette[mode] ?? palette.light;
        Object.entries(vars).forEach(([key, value]) => {
            const cssVar = `--${toKebab(key)}`; // e.g. --body-from
            document.documentElement.style.setProperty(cssVar, value);
        });

        if (mode === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');

        current = { palette: paletteName, mode };
        return true;
    }

    function saveTheme(paletteName = current.palette, mode = current.mode) {
        const payload = { palette: paletteName, mode };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    }

    function loadTheme() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            applyPalette(current.palette, current.mode);
            return current;
        }
        try {
            const parsed = JSON.parse(raw);
            const applied = applyPalette(parsed.palette, parsed.mode);
            if (applied) current = { palette: parsed.palette, mode: parsed.mode };
            return current;
        } catch (err) {
            console.warn('[THEME] invalid stored theme, resetting to default');
            applyPalette(current.palette, current.mode);
            return current;
        }
    }

    function setTheme(paletteName, mode = 'light', persist = true) {
        const ok = applyPalette(paletteName, mode);
        if (!ok) return false;
        if (persist) saveTheme(paletteName, mode);
        return true;
    }

    function getPalettes() {
        return palettes.map(p => ({ name: p.name }));
    }

    function getCurrent() {
        return Object.assign({}, current);
    }

    return {
        palettes,
        applyPalette,
        setTheme,
        loadTheme,
        saveTheme,
        getPalettes,
        getCurrent
    };
})();
