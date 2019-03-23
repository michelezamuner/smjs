const View = require('../presenters/shared_presenter/View');
const Console = require('console-wrapper').Console;

module.exports = class SlothMachine_Core_HandleError_Views_ErrorView extends View {
    static get __DEPS__() { return [Console]; }

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
