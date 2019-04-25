const _package = 'SlothMachine.SlothMachine.Core.HandleError.Views.';

const View = require('../presenters/shared_presenter/View');
const Console = require('console-wrapper').Console;

module.exports = class ErrorView extends View {
    static get __DEPS__() { return [Console]; }
    static toString() { return _package + ErrorView.name; }

    /**
     * @param {Console} console
     */
    constructor(console) {
        super();
        this._console = console;
    }

    /**
     * @override
     */
    render(viewModel) {
        this._console.writeError(viewModel.getError());
        this._console.exit(View.ERROR_EXIT_STATUS);
    }
};
