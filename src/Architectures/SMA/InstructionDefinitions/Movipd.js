const Definition = require('../InstructionSet/Definition');
const PointerProvider = require('../InstructionSet/PointerProvider');
const RegisterAddress = require('../RegisterAddress');
const Word = require('../../../DataTypes/Word');
const Byte = require('../../../DataTypes/Byte');

/**
 * @implements Definition
 */
module.exports = class Movipd extends Definition {
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
        const value = new Word(byte3, byte4);

        if (!register.isHalf()) {
            throw `Cannot use register ${register.format()} as pointer`;
        }
        const address = this._registers.get(register);
        const bytes = value.expand();
        this._memory.write(address, new Byte(0x00));
        this._memory.write(address.add(new Byte(0x01)), new Byte(0x00));
        this._memory.write(address.add(new Byte(0x02)), bytes[0]);
        this._memory.write(address.add(new Byte(0x03)), bytes[1]);
    }
};
