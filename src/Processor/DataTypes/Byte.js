/**
 * Byte data type to be used for registers' values.
 */
module.exports = class Byte {
    /**
     * @param {number|string} value
     */
    constructor(value) {
        this._value = value instanceof Byte ? value._value : '' + value;
    }

    /**
     * @param {Byte} byte
     * @returns {boolean}
     */
    equals(byte) {
        return this._value === byte._value;
    }

    /**
     * @returns {number}
     */
    toInt() {
        return parseInt(this._value);
    }
};
