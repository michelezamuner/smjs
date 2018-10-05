const InterpreterInterface = require('../../ProcessorInterfaces/Interpreter');
const Memory = require('../../ProcessorInterfaces/Memory');
const Exit = require('../../ProcessorInterfaces/Exit');
const Byte = require('../../DataTypes/Byte');
const Word = require('../../DataTypes/Word');
const Mnemonics = require('./Mnemonics');
const Registers = require('./Registers');

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
     * @param {Memory} memory
     */
    constructor(registers, memory) {
        super();
        this._registers = registers;
        this._memory = memory;
        this._exit = new Exit;
    }

    /**
     * @inheritDoc
     */
    getInstructionSize() {
        return new Byte(4);
    }

    /**
     * @inheritDoc
     */
    exec([byte1, byte2, byte3, byte4]) {
        if (byte1.equals(Mnemonics.mov)) {
            this._mov(byte2, byte3);
        } else if (byte1.equals(Mnemonics.movi)) {
            this._movi(byte2, byte3);
        } else if (byte1.equals(Mnemonics.movmb)) {
            this._movmb(byte2, new Word(byte3, byte4));
        } else if (byte1.equals(Mnemonics.movmw)) {
            this._movmw(byte2, new Word(byte3, byte4));
        } else if (byte1.equals(Mnemonics.movmr)) {
            this._movmr(new Word(byte2, byte3), byte4);
        } else if (byte1.equals(Mnemonics.movmi)) {
            this._movmi(new Word(byte2, byte3), byte4);
        } else if (byte1.equals(Mnemonics.syscall)) {
            this._syscall();
        }

        return this._exit;
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
     * @param {Byte} register
     * @param {Word} address
     * @private
     */
    _movmb(register, address) {
        this._registers.set(register, new Word(new Byte(0x00), this._memory.read(address)));
    }

    /**
     * @param {Byte} register
     * @param {Word} address
     * @private
     */
    _movmw(register, address) {
        this._registers.set(register, new Word(...this._memory.readSet(address, new Byte(0x02))));
    }

    /**
     * @param {Word} address
     * @param {Byte} register
     * @private
     */
    _movmr(address, register) {
        const bytes = this._registers.get(register).toBytes();
        this._memory.write(address, bytes[0]);
        this._memory.write(address.add(new Byte(0x01)), bytes[1]);
    }

    /**
     * @param {Word} address
     * @param {Byte} value
     * @private
     */
    _movmi(address, value) {
        this._memory.write(address, value);
    }

    /**
     * @private
     */
    _syscall() {
        const eax = this._registers.get(Mnemonics.eax);
        if (eax.equals(this.constructor.SYS_EXIT)) {
            this._exit = new Exit(true, this._registers.get(Mnemonics.ebx));
        }
    }
};
