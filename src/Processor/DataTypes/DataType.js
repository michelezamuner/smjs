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

        if (this._value < -new.target.MAX || value > new.target.MAX) {
            throw 'Value out of bounds';
        }

        if (this._value === undefined) {
            throw `Data types must be constructed from integers, got '${value}' instead`;
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
     */
    toInt() {
        return this._value;
    }
};
