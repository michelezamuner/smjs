const DataType = require('./DataType');

module.exports = class Byte extends DataType {
    /**
     * @returns {number}
     */
    static get MAX() {
        return 255;
    }

    /**
     * @param {number|Byte} value
     */
    constructor(value) {
        super(value);
    }
};
