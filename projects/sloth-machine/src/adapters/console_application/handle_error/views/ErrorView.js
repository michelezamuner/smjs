const View = require('../presenters/shared_presenter/View');
const Console = require('ui-console').Console;
const ViewModel = require('../presenters/shared_presenter/ViewModel');

module.exports = class ErrorView extends View {
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
        this._console.write(viewModel.getError(), Console.STREAM_STDERR);
        this._console.exit(View.ERROR_EXIT_STATUS);
    }
};
