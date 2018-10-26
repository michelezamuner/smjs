const Definition = require('../InstructionSet/Definition');
const PointerProvider = require('../InstructionSet/PointerProvider');
const RegisterAddress = require('../RegisterAddress');
const Byte = require('../../../DataTypes/Byte');
const Word = require('../../../DataTypes/Word');

/**
 * @implements Definition
 */
module.exports = class Movm extends Definition {
    /**
     * @param {PointerProvider} provider
     */
    constructor(provider) {
        super();
        this._registers = provider.getRegisters();
        this._memory = provider.getMemory();
    }

    /**
     * @inheritDoc
     */
    exec(byte2, byte3, byte4) {
        const register = new RegisterAddress(byte2);
        const address = new Word(byte3, byte4);
        const type = register.getType();
        const value = this._memory.readSet(address, new Byte(type.SIZE));
        this._registers.set(register, new type(...value));
    }
};
