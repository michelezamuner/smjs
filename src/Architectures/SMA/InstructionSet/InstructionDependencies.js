const Registers = require('../Registers');
const Memory = require('../../../ProcessorInterfaces/Memory');
const Stack = require('../Stack');
const System = require('../System');

module.exports = class InstructionDependencies {
    /**
     * @param {Registers} registers
     * @param {Memory} memory
     * @param {Stack} stack
     * @param {System} system
     */
    constructor(registers, memory, stack, system) {
        this._registers = registers;
        this._memory = memory;
        this._stack = stack;
        this._system = system;
    }

    /**
     * @return {Registers}
     */
    getRegisters() {
        return this._registers;
    }

    /**
     * @return {Memory}
     */
    getMemory() {
        return this._memory;
    }

    /**
     * @return {Stack}
     */
    getStack() {
        return this._stack;
    }

    /**
     * @return {System}
     */
    getSystem() {
        return this._system;
    }
};
