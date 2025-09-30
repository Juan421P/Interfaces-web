export class Interface {

    constructor() {
        this.initialized = false;
    }

    static getTemplate() {
        return '';
    }

    async init() {
        throw new Error('init() method must be implemented by subclass');
    }

    async render(container = '#main-view') {
        try {
            const template = this.constructor.getTemplate();
            const host = typeof container === 'string' ? document.querySelector(container) : container;

            if (!host) {
                throw new Error(`Container not found: ${container}`);
            }

            host.innerHTML = template;
            await this.init();
            this.initialized = true;

        } catch (error) {
            console.error(`Interface render failed:`, error);
            throw error;
        }
    }

    destroy() {
        this.initialized = false;
    }
    
}