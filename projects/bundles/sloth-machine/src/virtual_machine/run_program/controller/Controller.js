const RunProgram = require('app/virtual-machine').run_program.RunProgram;
const Request = require('./Request');

module.exports = class SlothMachine_VirtualMachine_RunProgram_Controller_Controller {
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
