module.exports = class Signal_Signal {
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
