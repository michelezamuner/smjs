const Interpreter = require('../interpreter/Interpreter');
const System = require('./System');

/**
 * @interface
 */
module.exports = class Architecture {
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
