const Definition = require('../InstructionSet/Definition');
const Registers = require('../Registers');
const RegisterAddress = require('../RegisterAddress');
const Byte = require('../../../DataTypes/Byte');
const Word = require('../../../DataTypes/Word');
const Double = require('../../../DataTypes/Double');

module.exports = class Mul extends Definition {
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
        const multiplierRegister = new RegisterAddress(byte3);
        if (multiplicandRegister.getType() !== multiplierRegister.getType()) {
            throw new Error(
                `Type mismatch: cannot multiply register ${multiplicandRegister} by register ${multiplierRegister}`
            );
        }
        const type = multiplicandRegister.getType().name;
        this[`_multiply${type}s`](multiplicandRegister, multiplierRegister);
    }

    /**
     * @param {RegisterAddress} multiplicandRegister
     * @param {RegisterAddress} multiplierRegister
     * @private
     */
    _multiplyBytes(multiplicandRegister, multiplierRegister) {
        const resultRegister = multiplicandRegister.toHalf();
        const multiplicand = this._registers.get(multiplicandRegister);
        const multiplier = this._registers.get(multiplierRegister);
        const result = multiplicand.mul(multiplier);
        this._registers.set(resultRegister, new Word(...result));
    }

    /**
     * @param {RegisterAddress} multiplicandRegister
     * @param {RegisterAddress} multiplierRegister
     * @private
     */
    _multiplyWords(multiplicandRegister, multiplierRegister) {
        const resultRegister = multiplicandRegister.toWhole();
        const multiplicand = this._registers.get(multiplicandRegister);
        const multiplier = this._registers.get(multiplierRegister);
        const result = multiplicand.mul(multiplier);
        this._registers.set(resultRegister, new Double(...result[0].expand(), ...result[1].expand()));
    }

    /**
     * @param {RegisterAddress} multiplicandRegister
     * @param {RegisterAddress} multiplierRegister
     * @private
     */
    _multiplyDoubles(multiplicandRegister, multiplierRegister) {
        const resultHighRegister = multiplicandRegister;
        const resultLowRegister = multiplicandRegister.eq(new RegisterAddress(this._registers.getResultLowRegister()))
            ? new RegisterAddress(this._registers.getResultLowRegisterAlternate())
            : new RegisterAddress(this._registers.getResultLowRegister());
        const multiplicand = this._registers.get(multiplicandRegister);
        const multiplier = this._registers.get(multiplierRegister);
        const result = multiplicand.mul(multiplier);
        this._registers.set(resultHighRegister, result[0]);
        this._registers.set(resultLowRegister, result[1]);
    }
};
