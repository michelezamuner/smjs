const _package = 'SensorSystem.Signal.';

module.exports = class Signal {
    static toString() { return _package + Signal.name; }

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
