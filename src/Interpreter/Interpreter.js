const Mnemonics = require('./Mnemonics');
const Registers = require('./Registers');
const DataType = require('../Processor/DataTypes/DataType');
const Byte = require('../Processor/DataTypes/Byte');
const Word = require('../Processor/DataTypes/Word');

/**
 * Interpreter of instructions
 */
module.exports = class Interpreter {
    /**
     * @returns {Byte}
     */
    static get SYS_EXIT() {
        return new Word(0x01);
    }

    /**
     * @param {Registers} registers
     */
    constructor(registers) {
        this._registers = registers;
    }

    /**
     * @param {Byte} byte1
     * @param {Byte} byte2
     * @param {Byte} byte3
     * @param {Byte} byte4
     */
    exec([byte1, byte2, byte3, byte4]) {
        if (byte1.equals(Mnemonics.mov)) {
            this._mov(byte2, byte3);
        } else if (byte1.equals(Mnemonics.movi)) {
            this._movi(byte2, byte3);
        } else if (byte1.equals(Mnemonics.syscall)) {
            this._syscall();
        }
    }

    /**
     * @param {Byte} first
     * @param {Byte} second
     * @private
     */
    _mov(first, second) {
        this._registers.set(first, this._registers.get(second));
    }

    /**
     * @param {Byte} register
     * @param {Byte} value
     * @private
     */
    _movi(register, value) {
        this._registers.set(register, new Word(new Byte(0x00), value));
    }

    /**
     * @private
     */
    _syscall() {
        const eax = this._registers.get(this._registers.eax);
        if (eax.equals(Interpreter.SYS_EXIT)) {
            this._registers.setExit();
            this._registers.setEs(this._registers.get(this._registers.ebx));
        }
    }
};
