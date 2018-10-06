const DataType = require('./DataType');

module.exports = class Byte extends DataType {
    /**
     * @inheritDoc
     */
    static get SIZE() {
        return 1;
    }

    /**
     * @inheritDoc
     */
    static get UNIT_TYPE() {
        return Byte;
    }

    /**
     * @param {number|Byte} value
     */
    constructor(value) {
        super(value);
    }
};
