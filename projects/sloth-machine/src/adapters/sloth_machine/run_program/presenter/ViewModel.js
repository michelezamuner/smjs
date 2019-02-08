module.exports = class ViewModel {
    /**
     * @param {number|null} exitStatus=null
     * @param {string|null} error=null
     */
    constructor(exitStatus = null, error = null) {
        this._exitStatus = exitStatus;
        this._error = error;
    }

    /**
     * @return {number}
     */
    getExitStatus() {
        return this._exitStatus;
    }

    /**
     * @return {string}
     */
    getError() {
        return this._error;
    }
};
