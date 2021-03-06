const _package = 'SlothMachine.VirtualMachine.RunProgram.';

const ExitStatus = require('domain/sloth-machine-framework').interpreter.ExitStatus;

module.exports = class Response {
    static toString() { return _package + Response.name; }

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
