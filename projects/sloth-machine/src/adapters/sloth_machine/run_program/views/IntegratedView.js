const View = require('../presenters/console_presenter/View');
const ViewModel = require('../presenters/console_presenter/ViewModel');
const Console = require('ui-console').Console;

module.exports = class IntegratedView extends View {
    static get __DEPS__() { return [Console]; }

    /**
     * @param {Console} console
     */
    constructor(console) {
        super();
        this._console = console;
    }

    /**
     * @param {ViewModel} viewModel
     */
    render(viewModel) {
        this._console.exit(viewModel.getExitStatus());
    }
};
