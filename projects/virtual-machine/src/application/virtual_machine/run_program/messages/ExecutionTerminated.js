const ExitStatus = require('sloth-machine-framework').ExitStatus;

module.exports = class ExecutionTerminated {
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
