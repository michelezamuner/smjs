const ControlRegisters = require('../../ProcessorInterfaces/Registers');
const Byte = require('../../DataTypes/Byte');
const Word = require('../../DataTypes/Word');
const Double = require('../../DataTypes/Double');

/**
 * @implements ControlRegisters
 */
module.exports = class extends ControlRegisters {
    constructor() {
        super();
        this._data = [new Double(0x00), new Double(0x00), new Double(0x00), new Double(0x00)];
        this._ip = new Word(0x00);
    }

    /**
     * @param {Byte} address
     * @returns {DataType}
     */
    get(address) {
        const left = (address.uint() & 12) >> 2;
        const right = address.uint() & 3;
        const regd = this._data[left];
        const regb = regd.toBytes();
        
        switch (right) {
            case 0: return new Byte(regb[3]);
            case 1: return new Byte(regb[2]);
            case 2: return new Word(regb[2], regb[3]);
            case 3: return regd;
        }
    }

    /**
     * @param {Byte} address
     * @param {DataType} value
     */
    set(address, value) {
        const left = (address.uint() & 12) >> 2;
        const right = address.uint() & 3;
        const regb = this._data[left].toBytes();

        switch (value.constructor.MAX) {
            case Double.MAX:
                this._data[left] = value;
                break;
            case Word.MAX:
                this._data[left] = new Double(regb[0], regb[1], ...value.toBytes());
                break;
            case Byte.MAX:
                this._data[left] = right === 1
                    ? new Double(regb[0], regb[1], value, regb[3])
                    : new Double(regb[0], regb[1], regb[2], value);
                break;
        }
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
