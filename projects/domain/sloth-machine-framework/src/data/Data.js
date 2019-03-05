const DataUnit = require('./DataUnit');

module.exports = class SlothMachineFramework_Data_Data {
    /**
     * @param {DataUnit[]} data
     */
    constructor(data = []) {
        this._data = data instanceof Data ? data._data : data;
    }

    /**
     * @param {Data} data
     * @return {boolean}
     */
    eq(data) {
        if (this._data.length !== data._data.length) {
            return false;
        }

        for (const i in this._data) {
            if (!this._data[i].eq(data._data[i])) {
                return false;
            }
        }

        return true;
    }

    /**
     * @return {DataUnit[]}
     */
    toArray() {
        return this._data;
    }
};
