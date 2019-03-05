const ViewModel = require('./ViewModel');

/**
 * @interface
 */
module.exports = class SlothMachine_Core_HandleError_Presenters_SharedPresenter_View {
    static get ERROR_EXIT_STATUS() { return 127; }

    constructor() {
        if (new.target === SlothMachine_Core_HandleError_Presenters_SharedPresenter_View) {
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
