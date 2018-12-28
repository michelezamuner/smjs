const Request = require('./Request');
const UnsupportedArchitectureException = require('core').UnsupportedArchitectureException;

module.exports = class Controller {
    /**
     * @param {Request} request
     */
    run(request) {
        throw new UnsupportedArchitectureException(request.getArchitecture());
    }
};
