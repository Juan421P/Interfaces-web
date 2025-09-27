import { DisplayComponent } from '../base/display-component.js';

export class DisplaySelect extends DisplayComponent {
    constructor(opts = {}) {
        super(opts);
        this.optionService = opts.optionService;
    }

    async _onDataLoaded() {
        this.options = this.data.map(item => ({
            value: item[this.idField],
            label: item[this.labelField]
        }));
        this._renderOptions();
    }
}