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

        switch (multiplicandRegister.getType()) {
            case Byte:
                this._multiplyBytes(multiplicandRegister, byte4);
                break;
            case Word:
                this._multiplyWords(multiplicandRegister, new Word(byte3, byte4));
                break;
            case Double:
                this._multiplyDoubles(multiplicandRegister, new Double(new Byte(), new Byte(), byte3, byte4));
                break;
        }
    }

    /**
     * @param {RegisterAddress} multiplicandRegister
     * @param {Byte} multiplier
     * @private
     */
    _multiplyBytes(multiplicandRegister, multiplier) {
        const resultRegister = multiplicandRegister.toHalf();
        const multiplicand = this._registers.get(multiplicandRegister);
        const result = new Word(...multiplicand.mul(multiplier));
        this._registers.set(resultRegister, result);
    }

    /**
     * @param {RegisterAddress} multiplicandRegister
     * @param {Word} multiplier
     * @private
     */
    _multiplyWords(multiplicandRegister, multiplier) {
        const resultRegister = multiplicandRegister.toWhole();
        const multiplicand = this._registers.get(multiplicandRegister);
        const result = multiplicand.mul(multiplier);
        this._registers.set(resultRegister, new Double(...result[0].expand(), ...result[1].expand()));
    }

    /**
     * @param {RegisterAddress} multiplicandRegister
     * @param {Double} multiplier
     * @private
     */
    _multiplyDoubles(multiplicandRegister, multiplier) {
        const resultLowRegister = multiplicandRegister.eq(new RegisterAddress(this._registers.getResultLowRegister()))
            ? new RegisterAddress(this._registers.getResultLowRegisterAlternate())
            : new RegisterAddress(this._registers.getResultLowRegister());
        const resultHighRegister = multiplicandRegister;
        const multiplicand = this._registers.get(multiplicandRegister);
        const result = multiplicand.mul(multiplier);
        this._registers.set(resultHighRegister, result[0]);
        this._registers.set(resultLowRegister, result[1]);
    }
};
