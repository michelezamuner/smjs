const ViewModel = require('./ViewModel');

/**
 * @interface
 */
module.exports = class SlothMachine_VirtualMachine_RunProgram_Presenters_ConsolePresenter_View {
    constructor() {
        if (new.target === SlothMachine_VirtualMachine_RunProgram_Presenters_ConsolePresenter_View) {
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
