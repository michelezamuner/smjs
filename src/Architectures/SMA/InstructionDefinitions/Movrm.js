const Definition = require('../InstructionSet/Definition');
const Registers = require('../Registers');
const Memory = require('../../../ProcessorInterfaces/Memory');
const RegisterAddress = require('../RegisterAddress');
const Word = require('../../../DataTypes/Word');

/**
 * @implements Definition
 */
module.exports = class Movrm extends Definition {
    /**
     * @inheritDoc
     */
    static getDependencies() {
        return [Registers, Memory];
    }

    /**
     * @param {Registers} registers
     * @param {Memory} memory
     */
    constructor(registers, memory) {
        super();
        this._registers = registers;
        this._memory = memory;
    }

    /**
     * @inheritDoc
     */
    exec(byte2, byte3, byte4) {
        const address = new Word(byte2, byte3);
        const register = new RegisterAddress(byte4);
        this._memory.write(address, this._registers.get(register));
    }
};
