module.exports = class SlothMachine_ErrorHandlerFailed {
    /**
     * @param {Error} error
     */
    constructor(error) {
        this._error = error;
    }

    /**
     * @return {Error}
     */
    getError() {
        return this._error;
    }
};
