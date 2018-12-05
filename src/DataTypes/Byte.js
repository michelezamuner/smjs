const DataType = require('./DataType');

module.exports = class Byte extends DataType {
    /**
     * @inheritDoc
     */
    static get SIZE() {
        return new Byte(1);
    }

    /**
     * @inheritDoc
     */
    static get UNIT_TYPE() {
        return Byte;
    }

    /**
     * @inheritDoc
     */
    static get _SCALAR_SIZE() {
        return 1;
    }

    /**
     * @param {number|Byte} value
     */
    constructor(value = 0x00) {
        super(value);
    }
};
