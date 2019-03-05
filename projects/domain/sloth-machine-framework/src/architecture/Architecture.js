const Interpreter = require('../interpreter/Interpreter');
const System = require('./System');

/**
 * @interface
 */
module.exports = class SlothMachineFramework_Architecture_Architecture {
    constructor() {
        if (new.target === SlothMachineFramework_Architecture_Architecture) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @param {System} system
     * @return {Interpreter}
     */
    getInterpreter(system) {
        throw 'Not implemented';
    }
};
