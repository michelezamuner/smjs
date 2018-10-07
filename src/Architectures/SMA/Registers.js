const ControlRegisters = require('../../ProcessorInterfaces/Registers');
const DataType = require('../../DataTypes/DataType');
const Byte = require('../../DataTypes/Byte');
const Word = require('../../DataTypes/Word');
const Double = require('../../DataTypes/Double');
const RegisterAddress = require('./RegisterAddress');

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
     * @param {RegisterAddress} address
     * @returns {DataType}
     */
    get(address) {
        const value = this._data[address.getIndex()];
        const bytes = value.expand();

        if (address.isWhole()) {
            return value;
        }

        if (address.isHalf()) {
            return new Word(bytes[2], bytes[3]);
        }

        if (address.isLeftq()) {
            return bytes[2];
        }

        return bytes[3];
    }

    /**
     * @param {RegisterAddress} address
     * @param {DataType} value
     */
    set(address, value) {
        const index = address.getIndex();
        this._data[index] = this._getUpdatedValue(address, value, this._data[index].expand());
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

    /**
     * @param {RegisterAddress} address
     * @param {DataType} value
     * @param {Byte[]} original
     * @return {Double}
     * @private
     */
    _getUpdatedValue(address, value, original) {
        if (value instanceof Double) {
            return value;
        }

        if (value instanceof Word) {
            return new Double(original[0], original[1], ...value.expand());
        }

        if (address.isLeftq()) {
            return new Double(original[0], original[1], value, original[3]);
        }

        return new Double(original[0], original[1], original[2], value);
    }
};
