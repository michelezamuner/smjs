module.exports = class MissingExitException {
    /**
     * @param {string} message
     */
    constructor(message) {
        this._message = message;
    }

    /**
     * @returns {string}
     */
    getMessage() {
        return this._message;
    }
};
