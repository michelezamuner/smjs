const Size = require('../data/Size');
const Opcode = require('./Opcode');
const Instruction = require('./Instruction');
const Status = require('./Status');
const InterpreterException = require('./InterpreterException');

/**
 * @interface
 */
module.exports = class Interpreter {
    constructor() {
        if (new.target === Interpreter) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @return {Size}
     */
    getOpcodeSize() {
        throw 'Not implemented';
    }

    /**
     * @param {Opcode} opcode
     * @return {Size}
     * @throws {InterpreterException}
     */
    getOperandsSize(opcode) {
        throw 'Not implemented';
    }

    /**
     * @param {Instruction} instruction
     * @return {Status}
     * @throws {InterpreterException}
     */
    exec(instruction) {
        throw 'Not implemented';
    }
};
