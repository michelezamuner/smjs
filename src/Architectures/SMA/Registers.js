const ControlRegisters = require('../../ProcessorInterfaces/Registers');
const Byte = require('../../DataTypes/Byte');
const Word = require('../../DataTypes/Word');
const Mnemonics = require('./Mnemonics');

/**
 * @implements ControlRegisters
 */
module.exports = class extends ControlRegisters {
    constructor() {
        super();
        this._main = {};
        this._main[Mnemonics.eax.toInt()] = new Word(0x00);
        this._main[Mnemonics.ebx.toInt()] = new Word(0x00);
        this._main[Mnemonics.ecx.toInt()] = new Word(0x00);
        this._main[Mnemonics.edx.toInt()] = new Word(0x00);
        this._ip = new Word(0x00);
    }

    /**
     * @param {Byte} address
     * @returns {DataType}
     */
    get(address) {
        return this._main[address.toInt()];
    }

    /**
     * @param {Byte} address
     * @param {Word} value
     */
    set(address, value) {
        this._main[address.toInt()] = value;
    }

    /**
     * @inheritDoc
     */
    getIp() {
        return this._ip;
    }

    /**
     * @inheritDoc
     */
    setIp(ip) {
        this._ip = ip;
    }
};
