const DataUnit = require('./DataUnit');

module.exports = class Data {
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
