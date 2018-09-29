/** @interface */
const ControlRegisters = require('../../src/ProcessorArchitecture/ControlRegisters');
const Registers = require('../../src/Registers/Registers');
const Byte = require('../DataTypes/Byte');
const Word = require('../DataTypes/Word');
const Double = require('../DataTypes/Double');

/**
 * @implements ControlRegisters
 */
module.exports = class extends ControlRegisters {
    constructor() {
        super();
        this._registers = new Registers({
            eax: Word,
            ebx: Word,
            ecx: Word,
            edx: Word,
            ip: Word,
            ir: Double,
            et: Byte,
            es: Word,
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
        this._registers.set(this._registers.ip, new Word(this.getIp().get() + this.getIs()));
    }

    setIp(ip) {
        this._registers.set(this._registers.ip, ip);
    }

    getIr() {
        return this._registers.get(this._registers.ir);
    }

    /**
     * @inheritDoc
     */
    setIr(ir) {
        this._registers.set(this._registers.ir, ir);
    }

    /**
     * @inheritDoc
     */
    shouldExit() {
        return this._registers.get(this._registers.et).equals(new Byte(0x01));
    }

    setExit() {
        this._registers.set(this._registers.et, new Byte(0x01));
    }

    /**
     * @inheritDoc
     */
    getEs() {
        return this._registers.get(this._registers.es);
    }

    setEs(es) {
        this._registers.set(this._registers.es, es);
    }
};
