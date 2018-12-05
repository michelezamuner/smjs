/**
 * @abstract
 */
module.exports = class DataType {
    /**
     * @return {DataType}
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
     * @return {number}
     * @private
     */
    static get _SCALAR_SIZE() {
        throw 'Not implemented';
    }

    /**
     * @param {number|DataType} value
     */
    constructor(value) {
        if (new.target === DataType) {
            throw new Error('Abstract class cannot be instantiated');
        }

        this._value = this._extractValue(value);
    }

    /**
     * @return {DataType}
     */
    clone() {
        return new this.constructor(this._value);
    }

    /**
     * @param {DataType} dataType
     * @return {boolean}
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
     * @return {DataType[]}
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
        for (let i = 0; i < this.constructor._SCALAR_SIZE; i++) {
            bytes[i] = values[i] ? values[i] : 0x00;
        }

        return bytes.reverse().map(val => new this.constructor.UNIT_TYPE(val));
    }

    /**
     * @param {function} type
     * @return {DataType}
     */
    cast(type) {
        if (type.SIZE < this.constructor._SCALAR_SIZE) {
            throw new Error(`Cannot cast data type of size ${this.constructor._SCALAR_SIZE} to data type of size ${type._SCALAR_SIZE}`);
        }

        return new type(this._value);
    }

    /**
     * @return {DataType}
     */
    inc() {
        return new this.constructor(this._value + 1);
    }

    /**
     * @return {DataType}
     */
    dec() {
        return new this.constructor(this._value - 1);
    }

    /**
     * @param {DataType} dataType
     * @return {DataType}
     */
    add(dataType) {
        return new this.constructor(this._value + dataType._value);
    }

    /**
     * @param {DataType} dataType
     * @return {DataType}
     */
    sub(dataType) {
        return new this.constructor(this._value - dataType._value);
    }

    /**
     * @param {DataType} dataType
     * @return {DataType}
     */
    mul(dataType) {
        if (dataType.constructor._SCALAR_SIZE !== this.constructor._SCALAR_SIZE) {
            throw new Error(`Type mismatch: cannot multiply types of different sizes`);
        }

        const result = this._value * dataType._value;
        const modulo = this._getMax() + 1;
        return [new this.constructor(Math.floor(result / modulo)), new this.constructor(result % modulo)];
    }

    /**
     * @param {DataType} dataType
     * @return {boolean}
     */
    lt(dataType) {
        return this._value < dataType._value;
    }

    /**
     * @param {DataType} dataType
     * @return {boolean}
     */
    ltoe(dataType) {
        return this._value <= dataType._value;
    }

    /**
     * @param {DataType} dataType
     * @return {boolean}
     */
    gt(dataType) {
        return this._value > dataType._value;
    }

    /**
     * @param {DataType} dataType
     * @return {boolean}
     */
    gtoe(dataType) {
        return this._value >= dataType._value;
    }

    /**
     * @param {*} value
     * @return {number}
     * @private
     */
    _extractValue(value) {
        if (value instanceof this.constructor) {
            return value._value;
        }

        if (!Number.isInteger(value) || value < 0) {
            throw new Error(`Data types must be constructed from positive integers, got '${value}' instead`);
        }

        if (value > this._getMax()) {
            throw new Error(`Value out of bounds for type of size ${this.constructor._SCALAR_SIZE}: ${value}`);
        }

        return value;
    }

    /**
     * @return {number}
     * @private
     */
    _getMax() {
        return 2 ** (8 * this.constructor._SCALAR_SIZE) - 1;
    }
};
