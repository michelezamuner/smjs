const View = require('../presenters/ConsolePresenter/View');
const ViewModel = require('../presenters/ConsolePresenter/ViewModel');
const Console = require('./Console');

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
