const _package = 'SlothMachine.VirtualMachine.RunProgram.Messages.';

module.exports = class ApplicationFailed {
    static toString() { return _package + ApplicationFailed.name; }

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
