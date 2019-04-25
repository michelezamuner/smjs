const _package = 'SlothMachine.SlothMachineFramework.Interpreter.';

const Address = require('../data/Address');
const Opcode = require('./Opcode');
const Operands = require('./Operands');

module.exports = class Instruction {
    static toString() { return _package + Instruction.name; }

    /**
     * @param {Address} address
     * @param {Opcode} opcode
     * @param {Operands} operands
     */
    constructor(address, opcode, operands) {
        this._address = address;
        this._opcode = opcode;
        this._operands = operands;
    }

    /**
     * @return {Address}
     */
    getAddress() {
        return this._address;
    }

    /**
     * @return {Opcode}
     */
    getOpcode() {
        return this._opcode;
    }

    /**
     * @return {Operands}
     */
    getOperands() {
        return this._operands;
    }
};
