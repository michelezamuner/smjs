const RunProgram = require('app/virtual-machine').run_program.RunProgram;
const Request = require('./Request');

/**
 * Controller for run_program: translates input data using adapter-specific format into request data using
 * application-specific format.
 *
 * Primary port: virtual_machine
 * Primary adapter: sloth_machine
 * Use case: run_program
 */
module.exports = class Controller {
    static get DEFAULT_ARCHITECTURE() { return 'sma'; }
    static get __DEPS__() { return [ RunProgram ]; }

    /**
     * @param {RunProgram} service
     */
    constructor(service) {
        this.service = service;
    }

    /**
     * @param {string} architectureName
     * @param {string} programFile
     */
    runProgram(architectureName, programFile) {
        const request = new Request(architectureName || Controller.DEFAULT_ARCHITECTURE, programFile);
        this.service.run(request);
    }
};
