const DataType = require('./DataType');

module.exports = class Byte extends DataType {
    /**
     * @inheritDoc
     */
    static get MAX() {
        return 0xFF;
    }

    /**
     * @param {number|Byte} value
     */
    constructor(value) {
        super(value);
    }
};
