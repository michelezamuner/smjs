const Interpreter = require('../interpreter/Interpreter');
const System = require('./System');

module.exports = class Architecture {
    /**
     * @param {System} system
     * @return {Interpreter}
     */
    getInterpreter(system) {
        throw 'Not implemented';
    }
};
