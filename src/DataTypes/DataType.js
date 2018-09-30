/**
 * @abstract
 */
module.exports = class DataType {
    /**
     * @return {number}
     * @abstract
     */
    static get SIZE() {
        throw 'Not implemented';
    }

    /**
     * @param {number} size
     * @returns {number}
     * @private
     */
    static _getMax(size) {
        return 2 ** (8 * size) - 1;
    }

    /**
     * @param {number} size
     * @param {number} value
     * @returns {number}
     * @private
     */
    static _toSignedInt(size, value) {
        const max = DataType._getMax(size);
        return value <= Math.floor(max / 2) ? value : value - max - 1;
    }

    /**
     * @param {number|DataType} value
     */
    constructor(value) {
        if (new.target === DataType) {
            throw 'Abstract class cannot be instantiated';
        }

        if (value instanceof new.target) {
            this._value = value._value;
        }

        if (Number.isInteger(value)) {
            this._value = value;
        }

        if (this._value > DataType._getMax(new.target.SIZE)) {
            throw `Value out of bounds: ${this._value}`;
        }

        if (this._value === undefined || this._value < 0) {
            throw `Data types must be constructed from positive integers, got '${value}' instead`;
        }
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
     * @abstract
     */
    toSignedInt() {
        throw 'Not implemented';
    }

    /**
     * @returns {number}
     */
    toInt() {
        return this._value;
    }
};
