const Definition = require('../InstructionSet/Definition');
const Registers = require('../Registers');
const Memory = require('../../../ProcessorInterfaces/Memory');
const System = require('../System');
const Register = require('../Mnemonics').register;
const RegisterAddress = require('../RegisterAddress');
const Byte = require('../../../DataTypes/Byte');
const Word = require('../../../DataTypes/Word');
const Double = require('../../../DataTypes/Double');

/**
 * @implements Definition
 */
module.exports = class Syscall extends Definition {
    /**
     * @return {Byte}
     */
    static get SYS_EXIT() {
        return new Byte(0x01);
    }

    /**
     * @return {Byte}
     */
    static get SYS_READ() {
        return new Byte(0x03);
    }

    /**
     * @return {Byte}
     */
    static get SYS_WRITE() {
        return new Byte(0x04);
    }

    /**
     * @inheritDoc
     */
    static getDependencies() {
        return [Registers, Memory, System];
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
    }

    /**
     * @inheritDoc
     */
    exec(byte2, byte3, byte4) {
        const call = this._registers.get(new RegisterAddress(Register.eax));
        switch (true) {
            case call.eq(this.constructor.SYS_EXIT):
                this._sysExit();
                break;
            case call.eq(this.constructor.SYS_READ):
                this._sysRead();
                break;
            case call.eq(this.constructor.SYS_WRITE):
                this._sysWrite();
                break;
        }
    }

    _sysExit() {
        const value = this._registers.get(new RegisterAddress(Register.ebx));
        this._registers.setExit(value.expand()[3]);
    }

    _sysRead() {
        const fd = this._registers.get(new RegisterAddress(Register.ebx));
        const mem = this._registers.get(new RegisterAddress(Register.ecx));
        const count = this._registers.get(new RegisterAddress(Register.edx));
        const buf = Buffer.alloc(parseInt(count));
        const read = this._system.read(parseInt(fd), buf, parseInt(count));

        for (let i = 0; i < read; i++) {
            this._memory.write(new Word(parseInt(mem) + i), new Byte(buf[i]));
        }

        this._registers.set(new RegisterAddress(Register.eax), new Double(read));
    }

    _sysWrite() {
        const fd = this._registers.get(new RegisterAddress(Register.ebx));
        const count = this._registers.get(new RegisterAddress(Register.edx));
        const mem = this._memory.readSet(this._registers.get(new RegisterAddress(Register.ecx)), count);
        const written = this._system.write(parseInt(fd), mem.map(byte => parseInt(byte)), parseInt(count));
        this._registers.set(new RegisterAddress(Register.eax), new Double(written));
    }
};
