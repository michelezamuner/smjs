const InterpreterInterface = require('../../ProcessorInterfaces/Interpreter');
const Memory = require('../../ProcessorInterfaces/Memory');
const Exit = require('../../ProcessorInterfaces/Exit');
const Byte = require('../../DataTypes/Byte');
const Word = require('../../DataTypes/Word');
const Double = require('../../DataTypes/Double');
const Register = require('./Mnemonics').register;
const Instruction = require('./Mnemonics').instruction;
const Registers = require('./Registers');
const RegisterAddress = require('./RegisterAddress');
const System = require('./System');

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
        return new Byte(0x01);
    }

    /**
     * @return {Byte}
     */
    static get SYS_WRITE() {
        return new Byte(0x04);
    }

    /**
     * @param {Registers} registers
     * @param {Memory} memory
     * @param {System} system
     */
    constructor(registers, memory, system) {
        super();
        this._registers = registers;
        this._memory = memory;
        this._system = system;
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
        if (byte1.eq(Instruction.mov)) {
            this._mov(new RegisterAddress(byte2), new RegisterAddress(byte3));
        } else if (byte1.eq(Instruction.movi)) {
            this._movi(new RegisterAddress(byte2), new Word(byte3, byte4));
        } else if (byte1.eq(Instruction.movim)) {
            this._movim(new Word(byte2, byte3), byte4);
        } else if (byte1.eq(Instruction.movipb)) {
            this._movipb(new RegisterAddress(byte2), new Word(byte3, byte4));
        } else if (byte1.eq(Instruction.movipw)) {
            this._movipw(new RegisterAddress(byte2), new Word(byte3, byte4));
        } else if (byte1.eq(Instruction.movipd)) {
            this._movipd(new RegisterAddress(byte2), new Word(byte3, byte4));
        } else if (byte1.eq(Instruction.movimp)) {
            this._movimp(new Word(byte2, byte3), byte4);
        } else if (byte1.eq(Instruction.movm)) {
            this._movm(new RegisterAddress(byte2), new Word(byte3, byte4));
        } else if (byte1.eq(Instruction.movp)) {
            this._movp(new RegisterAddress(byte2), new RegisterAddress(byte3));
        } else if (byte1.eq(Instruction.movrm)) {
            this._movrm(new Word(byte2, byte3), new RegisterAddress(byte4));
        } else if (byte1.eq(Instruction.movrp)) {
            this._movrp(new RegisterAddress(byte2), new RegisterAddress(byte3));
        } else if (byte1.eq(Instruction.movrmp)) {
            this._movrmp(new Word(byte2, byte3), new RegisterAddress(byte4));
        } else if (byte1.eq(Instruction.syscall)) {
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
        if (register.isLeftq() || register.isRightq()) {
            value = new Byte(value.expand()[1]);
        } else if (register.isWhole()) {
            value = new Double(new Byte(0x00), new Byte(0x00), ...value.expand());
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
     * @param {Word} value
     * @private
     */
    _movipb(register, value) {
        if (!register.isHalf()) {
            throw `Cannot use register ${register.format()} as pointer`;
        }
        const address = this._registers.get(register);
        const bytes = value.expand();
        this._memory.write(address, bytes[1]);
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
     * @param {RegisterAddress} register
     * @param {Word} value
     * @private
     */
    _movipd(register, value) {
        if (!register.isHalf()) {
            throw `Cannot use register ${register.format()} as pointer`;
        }
        const address = this._registers.get(register);
        const bytes = value.expand();
        this._memory.write(address, new Byte(0x00));
        this._memory.write(address.add(new Byte(0x01)), new Byte(0x00));
        this._memory.write(address.add(new Byte(0x02)), bytes[0]);
        this._memory.write(address.add(new Byte(0x03)), bytes[1]);
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
        const call = this._registers.get(new RegisterAddress(Register.eax));
        if (call.eq(this.constructor.SYS_EXIT)) {
            const value = this._registers.get(new RegisterAddress(Register.ebx));
            this._exit = new Exit(true, value.expand()[3]);
        } else if (call.eq(this.constructor.SYS_WRITE)) {
            const fd = this._registers.get(new RegisterAddress(Register.ebx));
            const count = this._registers.get(new RegisterAddress(Register.edx));
            const buf = this._memory.readSet(this._registers.get(new RegisterAddress(Register.ecx)), count);
            const written = this._system.write(fd.uint(), buf.map(byte => byte.uint()), count.uint());
            this._registers.set(new RegisterAddress(Register.eax), new Double(written));
        }
    }
};
