const RunProgram = require('virtual-machine').RunProgram;
const Request = require('./Request');

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
