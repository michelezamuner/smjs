const _package = 'SlothMachine.SlothMachine.VirtualMachine.RunProgram.Controller.';

const RunProgram = require('app/virtual-machine').run_program.RunProgram;
const Request = require('./Request');

module.exports = class Controller {
    static get DEFAULT_ARCHITECTURE() { return 'sma'; }
    static get __DEPS__() { return [ RunProgram ]; }
    static toString() { return _package + Controller.name; }

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
        const defaultArchitecture = Controller.DEFAULT_ARCHITECTURE;
        const request = new Request(architectureName || defaultArchitecture, programFile);
        this.service.run(request);
    }
};
