const _package = 'SlothMachine.SlothMachine.VirtualMachine.RunProgram.Presenters.ConsolePresenter.';

const ViewModel = require('./ViewModel');

/**
 * @interface
 */
module.exports = class View {
    static toString() { return _package + View.name; }

    constructor() {
        if (new.target === View) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @param {ViewModel} viewModel
     */
    render(viewModel) {
        throw 'Not implemented';
    }
};
