const HandleError = require('app/core').handle_error.HandleError;
const Request = require('./Request');

module.exports = class SlothMachine_Core_HandleError_Controller_Controller {
    static get __DEPS__() { return [ HandleError ]; }

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
