module.exports = class SlothMachineFramework_Data_Integer {
    /**
     * @param {*} value
     */
    constructor(value = null) {
        this._value = this._parseValue(value);
    }

    /**
     * @param {Integer} integer
     * @return {boolean}
     */
    eq(integer) {
        return this._value === integer._value;
    }

    /**
     * @return {string}
     */
    format() {
        return '' + this._value;
    }

    /**
     * @param {Integer} integer
     * @return {Integer}
     */
    add(integer) {
        return new Integer(this._value + integer._value);
    }

    /**
     * @param {*} value
     * @return {number}
     * @private
     */
    _parseValue(value) {
        if (!value) {
            return 0;
        }
        if (value instanceof Integer) {
            return value._value;
        }
        return parseInt(value);
    }
};
