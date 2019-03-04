const RequestInterface = require('app/core').handle_error.Request;

module.exports = class Request extends RequestInterface {
    /**
     * @param {Error} error
     */
    constructor(error) {
        super();
        this._error = error;
    }

    /**
     * @override
     */
    getError() {
        return this._error;
    }
};
