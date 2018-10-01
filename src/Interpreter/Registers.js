const ControlRegisters = require('../../src/ProcessorArchitecture/ControlRegisters');
const RegistersFactory = require('../../src/Registers/RegistersFactory');
const Byte = require('../DataTypes/Byte');
const Word = require('../DataTypes/Word');

/**
 * @implements ControlRegisters
 */
module.exports = class extends ControlRegisters {
    /**
     * @param {RegistersFactory} factory
     */
    constructor(factory) {
        super();
        this._registers = factory.create({
            eax: Word,
            ebx: Word,
            ecx: Word,
            edx: Word,
            ip: Word,
        });
        this.eax = this._registers.eax;
        this.ebx = this._registers.ebx;
        this.ecx = this._registers.ecx;
        this.edx = this._registers.edx;
    }

    /**
     * @inheritDoc
     */
    getIs() {
        return 4;
    }

    /**
     * @param {Byte} register
     * @returns {DataType}
     */
    get(register) {
        return this._registers.get(register);
    }

    /**
     * @param {Byte} register
     * @param {Word} value
     */
    set(register, value) {
        this._registers.set(register, value);
    }

    /**
     * @inheritDoc
     */
    getIp() {
        return this._registers.get(this._registers.ip);
    }

    /**
     * @inheritDoc
     */
    incrementIp() {
        this._registers.set(this._registers.ip, new Word(this.getIp().toInt() + this.getIs()));
    }

    /**
     * @param {Word} ip
     */
    setIp(ip) {
        this._registers.set(this._registers.ip, ip);
    }
};
