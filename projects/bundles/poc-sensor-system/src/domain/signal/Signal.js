module.exports = class Signal {
    /**
     * @param {string} value
     */
    constructor(value) {
        this._value = value;
    }

    /**
     * @return {string}
     */
    getValue() {
        return this._value;
    }
};
