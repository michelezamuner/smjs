const InterpreterInterface = require('../ProcessorArchitecture/Interpreter');
const Mnemonics = require('./Mnemonics');
const Registers = require('./Registers');
const Normalizer = require('../DataTypes/Normalizer');
const Byte = require('../DataTypes/Byte');
const Word = require('../DataTypes/Word');

/**
 * Interpreter of instructions
 *
 * @implements InterpreterInterface
 */
module.exports = class extends InterpreterInterface {
    /**
     * @returns {Byte}
     */
    static get SYS_EXIT() {
        return new Word(0x01);
    }

    /**
     * @param {Registers} registers
     * @param {Normalizer} normalizer
     */
    constructor(registers, normalizer) {
        super();
        this._registers = registers;
        this._normalizer = normalizer;
    }

    /**
     * @inheritDoc
     */
    exec() {
        const [byte1, byte2, byte3, byte4] = this._normalizer.normalize(this._registers.getIr());
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
        if (eax.equals(this.constructor.SYS_EXIT)) {
            this._registers.setExit();
            this._registers.setEs(this._registers.get(this._registers.ebx));
        }
    }
};
