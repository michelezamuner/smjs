module.exports = class VirtualMachine_RunProgram_Messages_ApplicationFailed {
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
