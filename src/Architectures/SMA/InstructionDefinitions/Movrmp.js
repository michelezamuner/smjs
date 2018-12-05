const Definition = require('../InstructionSet/Definition');
const Registers = require('../Registers');
const Memory = require('../../../ProcessorInterfaces/Memory');
const RegisterAddress = require('../RegisterAddress');
const Byte = require('../../../DataTypes/Byte');
const Word = require('../../../DataTypes/Word');

/**
 * @implements Definition
 */
module.exports = class Movrmp extends Definition {
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
        const actual = new Word(...this._memory.read(address, Word.SIZE));
        this._memory.write(actual, this._registers.get(register));
    }
};
