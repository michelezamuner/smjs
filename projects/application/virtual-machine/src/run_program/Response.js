const ExitStatus = require('domain/sloth-machine-framework').interpreter.ExitStatus;

module.exports = class VirtualMachine_RunProgram_Response {
    /**
     * @param {ExitStatus|null} exitStatus
     * @param {Error|null} error
     */
    constructor(exitStatus = null, error = null) {
        this._exitStatus = exitStatus;
        this._error = error;
    }

    /**
     * @return {ExitStatus|null}
     */
    getExitStatus() {
        return this._exitStatus;
    }

    /**
     * @return {Error|null}
     */
    getError() {
        return this._error;
    }
};
