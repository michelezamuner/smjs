const _package = 'SlothMachine.SlothMachine.VirtualMachine.RunProgram.Presenters.ConsolePresenter.';

module.exports = class ViewModel {
    static toString() { return _package + ViewModel.name; }

    /**
     * @param {number} exitStatus
     */
    constructor(exitStatus) {
        this._exitStatus = exitStatus;
    }

    /**
     * @return {number}
     */
    getExitStatus() {
        return this._exitStatus;
    }
};
