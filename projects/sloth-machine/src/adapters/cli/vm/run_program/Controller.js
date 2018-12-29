const RunProgram = require('core').RunProgram;
const Request = require('core').Request;
const UnsupportedArchitectureException = require('core').UnsupportedArchitectureException;

module.exports = class Controller {
    static get __DEPS__() { return [ RunProgram ]; }

    /**
     * @param {RunProgram} service
     */
    constructor(service) {
        this.service = service;
    }

    /**
     * @param {Request} request
     * @throws UnsupportedArchitectureException
     */
    runProgram(request) {
        this.service.run(request);
    }
};
