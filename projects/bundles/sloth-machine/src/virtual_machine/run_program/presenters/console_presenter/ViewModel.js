module.exports = class SlothMachine_VirtualMachine_RunProgram_Presenters_ConsolePresenter_ViewModel {
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
