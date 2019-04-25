const _package = 'SlothMachine.SlothMachineFramework.Data.';

module.exports = class DataUnit {
    static toString() { return _package + DataUnit.name; }

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
