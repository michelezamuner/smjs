const ExitStatus = require('sloth-machine-framework').ExitStatus;

module.exports = class ViewModel {
    /**
     * @param {ExitStatus} exitStatus
     */
    constructor(exitStatus) {
        this._exitStatus = exitStatus;
    }

    /**
     * @return {number}
     */
    getExitStatus() {
        return parseInt(this._exitStatus.format());
    }
};
