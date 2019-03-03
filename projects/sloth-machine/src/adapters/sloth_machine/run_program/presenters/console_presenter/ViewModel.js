module.exports = class ViewModel {
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