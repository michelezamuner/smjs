const Definition = require('../InstructionSet/Definition');
const RegistersProvider = require('../InstructionSet/RegistersProvider');
const RegisterAddress = require('../RegisterAddress');
const DataType = require('../../../DataTypes/Double');
const Byte = require('../../../DataTypes/Byte');
const Word = require('../../../DataTypes/Word');
const Double = require('../../../DataTypes/Double');

/**
 * @implements Definition
 */
module.exports = class Movi extends Definition {
    /**
     * @param {RegistersProvider} provider
     */
    constructor(provider) {
        super();
        this._registers = provider.getRegisters();
    }

    /**
     * @inheritdoc
     */
    exec(byte2, byte3, byte4) {
        const register = new RegisterAddress(byte2);
        const value = this._getValue(register, byte3, byte4);
        this._registers.set(register, value);
    }

    /**
     * @param {RegisterAddress} register
     * @param {Byte} byte3
     * @param {Byte} byte4
     * @return {DataType}
     * @private
     */
    _getValue(register, byte3, byte4) {
        if (register.isLeftq() || register.isRightq()) {
            return new Byte(byte4);
        }

        if (register.isWhole()) {
            return new Double(new Byte(0x00), new Byte(0x00), byte3, byte4);
        }

        return new Word(byte3, byte4);
    }
};
