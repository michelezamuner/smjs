const Definition = require('../InstructionSet/Definition');
const PointerProvider = require('../InstructionSet/PointerProvider');
const RegisterAddress = require('../RegisterAddress');
const Word = require('../../../DataTypes/Word');

/**
 * @implements Definition
 */
module.exports = class Movipb extends Definition {
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
        this._memory.write(address, bytes[1]);
    }
};
