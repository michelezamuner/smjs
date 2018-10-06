const InterpreterInterface = require('../../ProcessorInterfaces/Interpreter');
const Memory = require('../../ProcessorInterfaces/Memory');
const Exit = require('../../ProcessorInterfaces/Exit');
const Byte = require('../../DataTypes/Byte');
const Word = require('../../DataTypes/Word');
const Double = require('../../DataTypes/Double');
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
        if (byte1.eq(Mnemonics.mov)) {
            this._mov(byte2, byte3);
        } else if (byte1.eq(Mnemonics.movi)) {
            this._movi(byte2, byte3);
        } else if (byte1.eq(Mnemonics.movim)) {
            this._movim(new Word(byte2, byte3), byte4);
        } else if (byte1.eq(Mnemonics.movm)) {
            this._movm(byte2, new Word(byte3, byte4));
        } else if (byte1.eq(Mnemonics.movrm)) {
            this._movrm(new Word(byte2, byte3), byte4);
        } else if (byte1.eq(Mnemonics.syscall)) {
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
        const [dest, src] = [first.uint(), second.uint()];
        const [dRight, sRight] = [dest & 3, src & 3];
        if ((dRight > 1 || sRight > 1) && dRight !== sRight) {
            throw `Cannot move register 0x${src.toString(16)} to register 0x${dest.toString(16)}`;
        }
        this._registers.set(first, this._registers.get(second));
    }

    /**
     * @param {Byte} register
     * @param {Byte} value
     * @private
     */
    _movi(register, value) {
        if ((register.uint() & 3) > 1) {
            throw `Cannot move immediate value to register 0x${register.uint().toString(16)}`;
        }
        this._registers.set(register, value);
    }

    /**
     * @param {Word} address
     * @param {Byte} value
     * @private
     */
    _movim(address, value) {
        this._memory.write(address, value);
    }

    /**
     * @param {Byte} register
     * @param {Word} address
     * @private
     */
    _movm(register, address) {
        const right = register.uint() & 3;
        let size = null;
        let type = null;
        if (right <= 1) {
            size = 1;
            type = Byte;
        } else if (right === 2) {
            size = 2;
            type = Word;
        } else if (right === 3) {
            size = 4;
            type = Double;
        }

        if (type === Byte) {
            this._registers.set(register, this._memory.read(address));
            return;
        }
        this._registers.set(register, new type(...this._memory.readSet(address, new Byte(size))));
    }

    /**
     * @param {Word} address
     * @param {Byte} register
     * @private
     */
    _movrm(address, register) {
        const value = this._registers.get(register);
        let bytes = null;
        let size = 2;
        if (value instanceof Byte) {
            size = 1;
            bytes = [value];
        } else {
            size = 4;
        }

        if (bytes === null) {
            bytes = value.toBytes();
        }

        for (let i = 0; i < size; i++) {
            this._memory.write(address.add(new Byte(i)), bytes[i]);
        }
    }

    /**
     * @private
     */
    _syscall() {
        const call = this._registers.get(Mnemonics.al);
        if (call.eq(this.constructor.SYS_EXIT)) {
            this._exit = new Exit(true, this._registers.get(Mnemonics.bl));
        }
    }
};
