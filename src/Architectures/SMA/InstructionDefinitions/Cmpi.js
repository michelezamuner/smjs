const Definition = require('../InstructionSet/Definition');
const Registers = require('../Registers');
const RegisterAddress = require('../RegisterAddress');
const Double = require('../../../DataTypes/Double');
const Word = require('../../../DataTypes/Word');
const Byte = require('../../../DataTypes/Byte');
const DataType = require('../../../DataTypes/DataType');

module.exports = class Cmpi extends Definition {
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
     * @inheritDoc
     */
    exec(byte2, byte3, byte4) {
        const registerAddress = new RegisterAddress(byte2);
        const left = this._registers.get(registerAddress);
        const right = this._getValue(registerAddress, byte3, byte4);
        this._registers.setFlag(Registers.FLAG_EQ, left.eq(right));
        this._registers.setFlag(Registers.FLAG_LT, left.lt(right));
        this._registers.setFlag(Registers.FLAG_GT, left.gt(right));
    }

    /**
     * @param {RegisterAddress} registerAddress
     * @param {Byte} byte3
     * @param {Byte} byte4
     * @return {DataType}
     * @private
     */
    _getValue(registerAddress, byte3, byte4) {
        if (registerAddress.isWhole()) {
            return new Double(new Byte(0x00), new Byte(0x00), byte3, byte4);
        }

        if (registerAddress.isHalf()) {
            return new Word(byte3, byte4);
        }

        return byte4;
    }
};
