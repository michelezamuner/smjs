const View = require('../presenter/View');
const Console = require('./Console');
const ViewModel = require('../presenter/ViewModel');

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
        if (viewModel.getError()) {
            this._console.write(viewModel.getError(), Console.STREAM_STDERR);
            this._console.exit(View.ERROR_EXIT_STATUS);
        }

        this._console.exit(viewModel.getExitStatus());
    }
};
