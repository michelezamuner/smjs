const Byte = require('../../DataTypes/Byte');
const Word = require('../../DataTypes/Word');
const Double = require('../../DataTypes/Double');

module.exports = class RegisterAddress {
    /**
     * @param {number} amount
     * @return {{rightq: {Byte}, leftq: {Byte}, half: {Byte}, whole: {Byte}}[]}
     */
    static generate(amount) {
        const addresses = [];
        const tot = amount * 4;
        for (let i = 0; i < tot; i += 4) {
            addresses.push({
                rightq: new Byte(i),
                leftq: new Byte(i + 1),
                half: new Byte(i + 2),
                whole: new Byte(i + 3)
            });
        }

        return addresses;
    }

    /**
     * @param {number|Byte} address
     */
    constructor(address) {
        this._address = address instanceof Byte ? parseInt(address) : address;
    }

    /**
     * @param {RegisterAddress} address
     * @return {boolean}
     */
    eq(address) {
        return this._address === address._address;
    }

    /**
     * @inheritDoc
     */
    toString() {
        return '0x' + this._address.toString(16);
    }

    /**
     * @return {function}
     */
    getType() {
        if (this.isWhole()) {
            return Double;
        }

        if (this.isHalf()) {
            return Word;
        }

        return Byte;
    }

    /**
     * @return {number}
     */
    getIndex() {
        return (this._address & 0b1100) >> 2;
    }

    /**
     * @return {boolean}
     */
    isWhole() {
        return (this._address & 0b0011) === 0b11;
    }

    /**
     * @return {boolean}
     */
    isHalf() {
        return (this._address & 0b0011) === 0b10;
    }

    /**
     * @return {boolean}
     */
    isLeftq() {
        return (this._address & 0b0011) === 0b01;
    }

    /**
     * @return {boolean}
     */
    isRightq() {
        return (this._address & 0b0011) === 0b00;
    }

    /**
     * @return {RegisterAddress}
     */
    toHalf() {
        return new this.constructor((this.getIndex() << 2) + 0b10);
    }

    /**
     * @return {RegisterAddress}
     */
    toWhole() {
        return new this.constructor((this.getIndex() << 2) + 0b11);
    }
};
