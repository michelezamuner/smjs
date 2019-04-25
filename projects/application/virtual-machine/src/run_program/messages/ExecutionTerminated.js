const _package = 'SlothMachine.VirtualMachine.RunProgram.Messages.';

const ExitStatus = require('domain/sloth-machine-framework').interpreter.ExitStatus;

module.exports = class ExecutionTerminated {
    static toString() { return _package + ExecutionTerminated.name; }

    /**
     * @param {ExitStatus} exitStatus
     */
    constructor(exitStatus) {
        this._exitStatus = exitStatus;
    }

    /**
     * @return {ExitStatus}
     */
    getExitStatus() {
        return this._exitStatus;
    }
};
