const _package = 'SlothMachine.SlothMachineFramework.Architecture.';

const Interpreter = require('../interpreter/Interpreter');
const System = require('./System');

/**
 * @interface
 */
module.exports = class Architecture {
    static toString() { return _package + Architecture.name; }

    constructor() {
        if (new.target === Architecture) {
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
