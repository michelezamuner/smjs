const Definition = require('../InstructionSet/Definition');
const PointerProvider = require('../InstructionSet/PointerProvider');
const RegisterAddress = require('../RegisterAddress');
const Byte = require('../../../DataTypes/Byte');

/**
 * @implements Definition
 */
module.exports = class Movp extends Definition {
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
        const dest = new RegisterAddress(byte2);
        const source = new RegisterAddress(byte3);

        if (!source.isHalf()) {
            throw `Cannot use register ${source.format()} as pointer`;
        }

        const addr = this._registers.get(source);
        const type = dest.getType();
        const value = this._memory.readSet(addr, new Byte(type.SIZE));
        this._registers.set(dest, new type(...value));
    }
};
