const Definition = require('../InstructionSet/Definition');
const Registers = require('../Registers');
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
     * @inheritDoc
     */
    static getDependencies() {
        return [Registers];
    }

    /**
     * @param {Registers} registers
     */
    constructor(registers) {
        super();
        this._registers = registers;
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
            return (new Word(byte3, byte4)).cast(Double);
        }

        return new Word(byte3, byte4);
    }
};
