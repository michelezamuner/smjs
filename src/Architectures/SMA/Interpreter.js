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
        } else if (byte1.eq(Mnemonics.movipm)) {
            this._movipm(new Word(byte2, byte3), byte4);
        } else if (byte1.eq(Mnemonics.movm)) {
            this._movm(new RegisterAddress(byte2), new Word(byte3, byte4));
        } else if (byte1.eq(Mnemonics.movrm)) {
            this._movrm(new Word(byte2, byte3), new RegisterAddress(byte4));
        } else if (byte1.eq(Mnemonics.syscall)) {
            this._syscall();
        }

        return this._exit;
    }

    /**
     * @param {RegisterAddress} first
     * @param {RegisterAddress} second
     * @private
     */
    _mov(first, second) {
        if (first.getType() !== second.getType()) {
            throw `Cannot move register ${second.format()} to register ${first.format()}`;
        }
        this._registers.set(first, this._registers.get(second));
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
            throw `Cannot move immediate value to pointer ${register.format()}`;
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
            throw `Cannot move immediate value to pointer ${register.format()}`;
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
    _movipm(address, value) {
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
        const value = type === Byte
            ? this._memory.read(address)
            : new type(...this._memory.readSet(address, new Byte(register.getType().SIZE)));
        this._registers.set(register, value);
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
     * @private
     */
    _syscall() {
        const call = this._registers.get(new RegisterAddress(Mnemonics.al));
        if (call.eq(this.constructor.SYS_EXIT)) {
            this._exit = new Exit(true, this._registers.get(new RegisterAddress(Mnemonics.bl)));
        }
    }
};
