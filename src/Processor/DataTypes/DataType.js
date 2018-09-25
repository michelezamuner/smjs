/**
 * @abstract
 */
module.exports = class DataType {
    /**
     * @param {number|DataType} value
     */
    constructor(value) {
        if (new.target === DataType) {
            throw 'Abstract class cannot be instantiated';
        }

        if (new.target.MAX === undefined) {
            throw 'MAX constant must be implemented';
        }

        if (value instanceof new.target) {
            this._value = value._value;
        }

        if (Number.isInteger(value)) {
            this._value = value;
        }

        if (this._value > new.target.MAX) {
            throw `Value out of bounds: ${this._value}`;
        }

        if (this._value === undefined || this._value < 0) {
            throw `Data types must be constructed from positive integers, got '${value}' instead`;
        }

        this._max = new.target.MAX;
    }

    /**
     * @param {DataType} dataType
     * @returns {boolean}
     */
    equals(dataType) {
        return this._value === dataType._value;
    }

    /**
     * @returns {number}
     */
    getSigned() {
        return this._value <= Math.floor(this._max / 2) ? this._value : this._value - this._max - 1;
    }

    /**
     * @returns {number}
     */
    get() {
        return this._value;
    }
};
