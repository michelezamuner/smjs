const Definition = require('../InstructionSet/Definition');
const SystemProvider = require('../InstructionSet/SystemProvider');
const Register = require('../Mnemonics').register;
const RegisterAddress = require('../RegisterAddress');
const Byte = require('../../../DataTypes/Byte');
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
    static get SYS_WRITE() {
        return new Byte(0x04);
    }

    /**
     * @param {SystemProvider} provider
     */
    constructor(provider) {
        super();
        this._registers = provider.getRegisters();
        this._memory = provider.getMemory();
        this._system = provider.getSystem();
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
            case call.eq(this.constructor.SYS_WRITE):
                this._sysWrite();
                break;
        }
    }

    _sysExit() {
        const value = this._registers.get(new RegisterAddress(Register.ebx));
        this._registers.setExit(value.expand()[3]);
    }

    _sysWrite() {
        const fd = this._registers.get(new RegisterAddress(Register.ebx));
        const count = this._registers.get(new RegisterAddress(Register.edx));
        const buf = this._memory.readSet(this._registers.get(new RegisterAddress(Register.ecx)), count);
        const written = this._system.write(fd.uint(), buf.map(byte => byte.uint()), count.uint());
        this._registers.set(new RegisterAddress(Register.eax), new Double(written));
    }
};
