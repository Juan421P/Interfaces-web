import { Component } from './component.js';

export class DisplayComponent extends Component {
    static getTemplate() {
        return `<div class="display-component">Display Component Template</div>`;
    }

    constructor(opts = {}) {
        super(opts);

        this.service = opts.service || null;
        this.autoLoad = opts.autoLoad !== false;
        this.data = opts.data || null;
        this.loading = false;
        this.error = null;

        if (this.service && !this._isValidService()) {
            throw new Error('DisplayComponent requires a valid service with list() method');
        }
    }

    _isValidService() {
        return this.service &&
            typeof this.service.list === 'function' &&
            typeof this.service.contract?.parse === 'function';
    }

    async loadData() {
        if (!this.service) return;

        this.loading = true;
        this.error = null;

        try {
            const rawData = await this.service.list();
            this.data = Array.isArray(rawData) ?
                rawData.map(item => this.service.contract.parse(item, 'table')) :
                this.service.contract.parse(rawData, 'table');

            this._onDataLoaded();
        } catch (error) {
            this.error = error;
            this._onDataError(error);
        } finally {
            this.loading = false;
        }
    }

    async _beforeRender() {
        if (this.autoLoad && this.service) {
            await this.loadData();
        }
    }

    _onDataLoaded() {
    }

    _onDataError(error) {
        console.error(`[${this.constructor.name}] Data load failed:`, error);
    }

    refresh() {
        return this.loadData();
    }
}