const DataType = require('./DataType');

module.exports = class Byte extends DataType {
    /**
     * @returns {number}
     */
    static get SIZE() {
        return 1;
    }

    /**
     * @param {number|Byte} value
     */
    constructor(value) {
        super(value);
    }
};
