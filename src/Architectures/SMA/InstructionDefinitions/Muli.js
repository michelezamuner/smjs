const Definition = require('../InstructionSet/Definition');
const Registers = require('../Registers');
const RegisterAddress = require('../RegisterAddress');
const Byte = require('../../../DataTypes/Byte');
const Word = require('../../../DataTypes/Word');
const Double = require('../../../DataTypes/Double');

/**
 * @implements Definition
 */
module.exports = class Muli extends Definition {
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
        const multiplicandRegister = new RegisterAddress(byte2);
        const type = multiplicandRegister.getType().name;
        this[`_multiply${type}s`](multiplicandRegister, byte3, byte4);
    }

    /**
     * @param {RegisterAddress} multiplicandRegister
     * @param {Byte} byte3
     * @param {Byte} byte4
     * @private
     */
    _multiplyBytes(multiplicandRegister, byte3, byte4) {
        const resultRegister = multiplicandRegister.toHalf();
        const multiplicand = this._registers.get(multiplicandRegister);
        const result = multiplicand.mul(byte4);
        this._registers.set(resultRegister, new Word(...result));
    }

    /**
     * @param {RegisterAddress} multiplicandRegister
     * @param {Byte} byte3
     * @param {Byte} byte4
     * @private
     */
    _multiplyWords(multiplicandRegister, byte3, byte4) {
        const resultRegister = multiplicandRegister.toWhole();
        const multiplicand = this._registers.get(multiplicandRegister);
        const multiplier = new Word(byte3, byte4);
        const result = multiplicand.mul(multiplier);
        this._registers.set(resultRegister, new Double(...result[0].expand(), ...result[1].expand()));
    }

    /**
     * @param {RegisterAddress} multiplicandRegister
     * @param {Byte} byte3
     * @param {Byte} byte4
     * @private
     */
    _multiplyDoubles(multiplicandRegister, byte3, byte4) {
        const resultLowRegister = multiplicandRegister.eq(new RegisterAddress(this._registers.getResultLowRegister()))
            ? new RegisterAddress(this._registers.getResultLowRegisterAlternate())
            : new RegisterAddress(this._registers.getResultLowRegister());
        const resultHighRegister = multiplicandRegister;
        const multiplicand = this._registers.get(multiplicandRegister);
        const multiplier = new Word(byte3, byte4).cast(Double);
        const result = multiplicand.mul(multiplier);
        this._registers.set(resultHighRegister, result[0]);
        this._registers.set(resultLowRegister, result[1]);
    }
};
