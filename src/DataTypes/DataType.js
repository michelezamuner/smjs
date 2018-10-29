/**
 * @abstract
 */
module.exports = class DataType {
    /**
     * @return {number}
     */
    static get SIZE() {
        throw 'Not implemented';
    }

    /**
     * @return {function}
     */
    static get UNIT_TYPE() {
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
     * @inheritDoc
     */
    toString() {
        return '0x' + this._value.toString(16);
    }

    /**
     * @returns {DataType[]}
     */
    expand() {
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
        for (let i = 0; i < this.constructor.SIZE; i++) {
            bytes[i] = values[i] ? values[i] : 0x00;
        }
        return bytes.reverse().map(val => new this.constructor.UNIT_TYPE(val));
    }

    /**
     * @return {DataType}
     */
    incr() {
        return new this.constructor(this._value + 1);
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

        if (value > this._getMax()) {
            throw `Value out of bounds for ${this.constructor.name}: ${value}`;
        }

        return value;
    }

    /**
     * @returns {number}
     * @private
     */
    _getMax() {
        return 2 ** (8 * this.constructor.SIZE) - 1;
    }
};
