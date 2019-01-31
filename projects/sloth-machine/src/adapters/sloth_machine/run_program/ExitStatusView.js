const View = require('./View');
const Console = require('./Console');
const ViewModel = require('./ViewModel');

module.exports = class ExitStatusView extends View {
    static get __DEPS__ () { return [Console]; }

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
        this._console.exit('', viewModel.getExitStatus());
    }
};
