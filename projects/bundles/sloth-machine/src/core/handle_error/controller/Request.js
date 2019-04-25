const _package = 'SlothMachine.SlothMachine.Core.HandleError.Controller.';

const RequestInterface = require('app/core').handle_error.Request;

module.exports = class Request extends RequestInterface {
    static toString() { return _package + Request.name; }

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
