const Response = require('./Response');

module.exports = class ErrorResponse extends Response {
    /**
     * @param {Error} error
     */
    constructor(error) {
        super();
        this._error = error;
    }

    /**
     * @return {Error}
     */
    getError() {
        return this._error;
    }
};
