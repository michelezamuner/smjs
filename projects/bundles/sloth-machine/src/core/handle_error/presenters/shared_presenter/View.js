const _package = 'SlothMachine.SlothMachine.Core.HandleError.Presenters.SharedPresenter.';

const ViewModel = require('./ViewModel');

/**
 * @interface
 */
module.exports = class View {
    static get ERROR_EXIT_STATUS() { return 127; }
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
