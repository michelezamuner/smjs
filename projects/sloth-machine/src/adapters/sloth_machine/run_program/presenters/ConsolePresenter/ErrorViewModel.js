module.exports = class ErrorViewModel {
    /**
     * @param {string} error
     */
    constructor(error) {
        this._error = error;
    }

    /**
     * @return {string}
     */
    getError() {
        return this._error;
    }
};
