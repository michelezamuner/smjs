const ErrorViewInterface = require('../adapters/sloth_machine/run_program/presenters/ConsolePresenter/ErrorView');
const ErrorViewModel = require('../adapters/sloth_machine/run_program/presenters/ConsolePresenter/ErrorViewModel');
const NativeConsole = require('./NativeConsole');

/**
 * @todo: Temporary class, this should be replaced with something else.
 */
module.exports = class ErrorView extends ErrorViewInterface {
    static get __DEPS__() { return [NativeConsole]; }

    /**
     * @param {NativeConsole} console
     */
    constructor(console) {
        super();
        this._console = console;
    }

    /**
     * @param {ErrorViewModel} viewModel
     */
    render(viewModel) {
        this._console.write(viewModel.getError(), 2);
        this._console.exit(127);
    }
};
