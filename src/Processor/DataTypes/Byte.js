const DataType = require('./DataType');

module.exports = class Byte extends DataType {
    /**
     * @returns {number}
     */
    static get MAX() {
        return 127;
    }

    /**
     * @param {number|Byte} value
     */
    constructor(value) {
        super(value);
    }
};
