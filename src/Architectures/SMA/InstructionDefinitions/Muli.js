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
        const result = new Word(parseInt(multiplicand) * parseInt(multiplier));
        this._registers.set(resultRegister, result);
    }

    _multiplyWords(multiplicandRegister, multiplier) {
        const resultRegister = multiplicandRegister.toWhole();
        const multiplicand = this._registers.get(multiplicandRegister);
        const result = new Double(parseInt(multiplicand) * parseInt(multiplier));
        this._registers.set(resultRegister, result);
    }
};
