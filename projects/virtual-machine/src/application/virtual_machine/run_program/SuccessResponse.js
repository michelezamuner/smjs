const Response = require('./Response');
const ExitStatus = require('sloth-machine-framework').ExitStatus;

module.exports = class SuccessResponse extends Response {
    /**
     * @param {ExitStatus} exitStatus
     */
    constructor(exitStatus) {
        super();
        this._exitStatus = exitStatus;
    }

    /**
     * @return {ExitStatus}
     */
    getExitStatus() {
        return this._exitStatus;
    }
};
