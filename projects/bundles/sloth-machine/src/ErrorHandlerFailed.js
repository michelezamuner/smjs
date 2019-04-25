const _package = 'SlothMachine.SlothMachine.';

module.exports = class ErrorHandlerFailed {
    static toString() { return _package + ErrorHandlerFailed.name; }

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
