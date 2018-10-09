const InterpreterInterface = require('../../ProcessorInterfaces/Interpreter');
const Memory = require('../../ProcessorInterfaces/Memory');
const Exit = require('../../ProcessorInterfaces/Exit');
const Byte = require('../../DataTypes/Byte');
const Word = require('../../DataTypes/Word');
const Mnemonics = require('./Mnemonics');
const Registers = require('./Registers');
const RegisterAddress = require('./RegisterAddress');

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
            this._mov(new RegisterAddress(byte2), new RegisterAddress(byte3));
        } else if (byte1.eq(Mnemonics.movi)) {
            this._movi(new RegisterAddress(byte2), new Word(byte3, byte4));
        } else if (byte1.eq(Mnemonics.movim)) {
            this._movim(new Word(byte2, byte3), byte4);
        } else if (byte1.eq(Mnemonics.movipb)) {
            this._movipb(new RegisterAddress(byte2), byte3);
        } else if (byte1.eq(Mnemonics.movipw)) {
            this._movipw(new RegisterAddress(byte2), new Word(byte3, byte4));
        } else if (byte1.eq(Mnemonics.movimp)) {
            this._movimp(new Word(byte2, byte3), byte4);
        } else if (byte1.eq(Mnemonics.movm)) {
            this._movm(new RegisterAddress(byte2), new Word(byte3, byte4));
        } else if (byte1.eq(Mnemonics.movp)) {
            this._movp(new RegisterAddress(byte2), new RegisterAddress(byte3));
        } else if (byte1.eq(Mnemonics.movmp)) {
            this._movmp(new RegisterAddress(byte2), new Word(byte3, byte4));
        } else if (byte1.eq(Mnemonics.movrm)) {
            this._movrm(new Word(byte2, byte3), new RegisterAddress(byte4));
        } else if (byte1.eq(Mnemonics.movrp)) {
            this._movrp(new RegisterAddress(byte2), new RegisterAddress(byte3));
        } else if (byte1.eq(Mnemonics.movrmp)) {
            this._movrmp(new Word(byte2, byte3), new RegisterAddress(byte4));
        } else if (byte1.eq(Mnemonics.syscall)) {
            this._syscall();
        }

        return this._exit;
    }

    /**
     * @param {RegisterAddress} target
     * @param {RegisterAddress} source
     * @private
     */
    _mov(target, source) {
        if (target.getType() !== source.getType()) {
            throw `Cannot move register ${source.format()} to register ${target.format()}`;
        }
        this._registers.set(target, this._registers.get(source));
    }

    /**
     * @param {RegisterAddress} register
     * @param {Word} value
     * @private
     */
    _movi(register, value) {
        if (register.isWhole()) {
            throw `Cannot move immediate value to register ${register.format()}`;
        }
        if (register.isLeftq() || register.isRightq()) {
            value = new Byte(value.expand()[1]);
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
     * @param {RegisterAddress} register
     * @param {Byte} value
     * @private
     */
    _movipb(register, value) {
        if (!register.isHalf()) {
            throw `Cannot use register ${register.format()} as pointer`;
        }
        const address = this._registers.get(register);
        this._memory.write(address, value);
    }

    /**
     * @param {RegisterAddress} register
     * @param {Word} value
     * @private
     */
    _movipw(register, value) {
        if (!register.isHalf()) {
            throw `Cannot use register ${register.format()} as pointer`;
        }
        const address = this._registers.get(register);
        const bytes = value.expand();
        this._memory.write(address, bytes[0]);
        this._memory.write(address.add(new Byte(0x01)), bytes[1]);
    }

    /**
     * @param {Word} address
     * @param {Byte} value
     * @private
     */
    _movimp(address, value) {
        const actual = new Word(...this._memory.readSet(address, new Byte(0x02)));
        this._memory.write(actual, value);
    }

    /**
     * @param {RegisterAddress} register
     * @param {Word} address
     * @private
     */
    _movm(register, address) {
        const type = register.getType();
        const value = this._memory.readSet(address, new Byte(type.SIZE));
        this._registers.set(register, new type(...value));
    }

    /**
     * @param {RegisterAddress} dest
     * @param {RegisterAddress} source
     * @private
     */
    _movp(dest, source) {
        if (!source.isHalf()) {
            throw `Cannot use register ${source.format()} as pointer`;
        }
        const addr = this._registers.get(source);
        const type = dest.getType();
        const value = this._memory.readSet(addr, new Byte(type.SIZE));
        this._registers.set(dest, new type(...value));
    }

    /**
     * @param {RegisterAddress} register
     * @param {Word} address
     * @private
     */
    _movmp(register, address) {
        const type = register.getType();
        const effective = new Word(...this._memory.readSet(address, new Byte(0x02)));
        const value = this._memory.readSet(effective, new Byte(type.SIZE));
        this._registers.set(register, new type(...value));
    }

    /**
     * @param {Word} address
     * @param {RegisterAddress} register
     * @private
     */
    _movrm(address, register) {
        const bytes = this._registers.get(register).expand();

        for (let i = 0; i < bytes.length; i++) {
            this._memory.write(address.add(new Byte(i)), bytes[i]);
        }
    }

    /**
     * @param {RegisterAddress} target
     * @param {RegisterAddress} source
     * @private
     */
    _movrp(target, source) {
        if (!target.isHalf()) {
            throw `Cannot use register ${target.format()} as pointer`;
        }
        const bytes = this._registers.get(source).expand();
        const type = source.getType();
        const effective = this._registers.get(target);
        for (let i = 0; i < type.SIZE; i++) {
            this._memory.write(effective.add(new Byte(i)), bytes[i]);
        }
    }

    /**
     * @param {Word} address
     * @param {RegisterAddress} register
     * @private
     */
    _movrmp(address, register) {
        const bytes = this._registers.get(register).expand();
        const effective = new Word(...this._memory.readSet(address, new Byte(0x02)));
        for (let i = 0; i < register.getType().SIZE; i++) {
            this._memory.write(effective.add(new Byte(i)), bytes[i]);
        }
    }

    /**
     * @private
     */
    _syscall() {
        const call = this._registers.get(new RegisterAddress(Mnemonics.al));
        if (call.eq(this.constructor.SYS_EXIT)) {
            this._exit = new Exit(true, this._registers.get(new RegisterAddress(Mnemonics.bl)));
        }
    }
};
