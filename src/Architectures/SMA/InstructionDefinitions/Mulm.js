const Definition = require('../InstructionSet/Definition');
const Registers = require('../Registers');
const RegisterAddress = require('../RegisterAddress');
const Memory = require('../../../ProcessorInterfaces/Memory');
const Double = require('../../../DataTypes/Double');
const Word = require('../../../DataTypes/Word');
const Byte = require('../../../DataTypes/Byte');

module.exports = class Mulm extends Definition {
    /**
     * @inheritDoc
     */
    static getDependencies() {
        return [Registers, Memory];
    }

    /**
     * @param {Registers} registers
     * @param {Memory} memory
     */
    constructor(registers, memory) {
        super();
        this._registers = registers;
        this._memory = memory;
    }

    /**
     * @inheritDoc
     */
    exec(byte2, byte3, byte4) {
        const multiplicandRegister = new RegisterAddress(byte2);
        const type = multiplicandRegister.getType();
        const multiplier = this._memory.readSet(new Word(byte3, byte4), type.SIZE);
        this[`_multiply${type.name}s`](multiplicandRegister, multiplier);
    }

    /**
     * @param {RegisterAddress} multiplicandRegister
     * @param {[Byte]} multiplier
     * @private
     */
    _multiplyBytes(multiplicandRegister, multiplier) {
        const resultRegister = multiplicandRegister.toHalf();
        const multiplicand = this._registers.get(multiplicandRegister);
        const result = multiplicand.mul(multiplier[0]);
        this._registers.set(resultRegister, new Word(...result));
    }

    /**
     * @param {RegisterAddress} multiplicandRegister
     * @param {[Byte, Byte]} multiplier
     * @private
     */
    _multiplyWords(multiplicandRegister, multiplier) {
        const resultRegister = multiplicandRegister.toWhole();
        const multiplicand = this._registers.get(multiplicandRegister);
        const result = multiplicand.mul(new Word(...multiplier));
        this._registers.set(resultRegister, new Double(...result[0].expand(), ...result[1].expand()));
    }

    /**
     * @param {RegisterAddress} multiplicandRegister
     * @param {[Byte, Byte, Byte, Byte]} multiplier
     * @private
     */
    _multiplyDoubles(multiplicandRegister, multiplier) {
        const resultHighRegister = multiplicandRegister;
        const resultLowRegister = multiplicandRegister.eq(new RegisterAddress(this._registers.getResultLowRegister()))
            ? new RegisterAddress(this._registers.getResultLowRegisterAlternate())
            : new RegisterAddress(this._registers.getResultLowRegister());
        const multiplicand = this._registers.get(multiplicandRegister);
        const result = multiplicand.mul(new Double(...multiplier));
        this._registers.set(resultHighRegister, result[0]);
        this._registers.set(resultLowRegister, result[1]);
    }
};
