/**
 * @abstract
 */
module.exports = class DataType {
    /**
     * @return {number}
     * @abstract
     */
    static get MAX() {
        throw 'Not implemented';
    }

    /**
     * @param {number|DataType} value
     */
    constructor(value) {
        if (new.target === DataType) {
            throw 'Abstract class cannot be instantiated';
        }

        this._value = this._extractValue(value);
    }

    /**
     * @param {DataType} dataType
     * @returns {boolean}
     */
    eq(dataType) {
        return this._value === dataType._value;
    }

    /**
     * @returns {number}
     */
    uint() {
        return this._value;
    }

    /**
     * @returns {number}
     */
    int() {
        return this._value <= Math.floor(this.constructor.MAX / 2)
            ? this._value
            : this._value - this.constructor.MAX - 1;
    }

    /**
     * @param {DataType} dataType
     * @returns {DataType}
     */
    add(dataType) {
        return new this.constructor(this._value + dataType._value);
    }

    /**
     * @param {DataType} dataType
     * @returns {DataType}
     */
    sub(dataType) {
        return new this.constructor(this._value - dataType._value);
    }

    /**
     * @param {DataType} dataType
     * @returns {boolean}
     */
    lt(dataType) {
        return this._value < dataType._value;
    }

    /**
     * @param {DataType} dataType
     * @returns {boolean}
     */
    ltoe(dataType) {
        return this._value <= dataType._value;
    }

    /**
     * @param {DataType} dataType
     * @returns {boolean}
     */
    gt(dataType) {
        return this._value > dataType._value;
    }

    /**
     * @param {DataType} dataType
     * @returns {boolean}
     */
    gtoe(dataType) {
        return this._value >= dataType._value;
    }

    /**
     * @param {*} value
     * @returns {number}
     * @private
     */
    _extractValue(value) {
        if (value instanceof this.constructor) {
            return value._value;
        }

        if (!Number.isInteger(value) || value < 0) {
            throw `Data types must be constructed from positive integers, got '${value}' instead`;
        }

        if (value > this.constructor.MAX) {
            throw `Value out of bounds for ${this.constructor.name}: ${value}`;
        }

        return value;
    }

    /**
     * @param {number} size
     * @returns {number[]}
     * @private
     */
    _toBytes(size) {
        const values = [];
        let value = this._value;
        while (true) {
            if (Math.floor(value / 0x100) === 0) {
                values.push(value);
                break;
            }
            let remainder = value % 0x100;
            values.push(remainder);
            value = (value - remainder) / 0x100;
        }
        const bytes = [];
        for (let i = 0; i < size; i++) {
            bytes[i] = values[i] ? values[i] : 0x00;
        }
        return bytes.reverse();
    }
};
