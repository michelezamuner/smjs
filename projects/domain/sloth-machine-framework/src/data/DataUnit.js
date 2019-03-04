module.exports = class DataUnit {
    /**
     * @param {number} value
     */
    constructor(value) {
        this._value = value;
    }

    /**
     * @param {DataUnit} dataUnit
     * @return {boolean}
     */
    eq(dataUnit) {
        return this._value === dataUnit._value;
    }

    /**
     * @return {string}
     */
    format() {
        return '' + this._value;
    }
};
