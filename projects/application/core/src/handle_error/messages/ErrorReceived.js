const _package = 'SlothMachine.Core.HandleError.Messages.';

module.exports = class ErrorReceived {
    static toString() { return _package + ErrorReceived.name; }

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
