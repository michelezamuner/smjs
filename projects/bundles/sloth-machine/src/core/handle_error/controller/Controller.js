const _package = 'SlothMachine.SlothMachine.Core.HandleError.Controller.';

const HandleError = require('app/core').handle_error.HandleError;
const Request = require('./Request');

module.exports = class Controller {
    static get __DEPS__() { return [ HandleError ]; }
    static toString() { return _package + Controller.name; }

    /**
     * @param {HandleError} service
     */
    constructor(service) {
        this._service = service;
    }

    /**
     * @param {Error} error
     */
    handleError(error) {
        this._service.handle(new Request(error));
    }
};
