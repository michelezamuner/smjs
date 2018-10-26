const RegistersProvider = require('./RegistersProvider');
const MemoryProvider = require('./MemoryProvider');
const SystemProvider = require('./SystemProvider');
const Registers = require('../Registers');
const Memory = require('../../../ProcessorInterfaces/Memory');
const System = require('../System');

/**
 * @implements RegistersProvider
 * @implements MemoryProvider
 * @implements SystemProvider
 */
module.exports = class InstructionDependencies {
    /**
     * @param {Registers} registers
     * @param {Memory} memory
     * @param {System} system
     */
    constructor(registers, memory, system) {
        this._registers = registers;
        this._memory = memory;
        this._system = system;
    }

    /**
     * @inheritDoc
     */
    getRegisters() {
        return this._registers;
    }

    /**
     * @inheritDoc
     */
    getMemory() {
        return this._memory;
    }

    /**
     * @inheritDoc
     */
    getSystem() {
        return this._system;
    }
};
