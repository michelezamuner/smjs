const DataType = require('./DataType');
const Byte = require('./Byte');

module.exports = class Word extends DataType {
    /**
     * @inheritDoc
     */
    static get SIZE() {
        return new Byte(2);
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
        return 2;
    }

    /**
     * @param {number|Word|Byte} value
     * @param {Byte=} byte2
     */
    constructor(value = 0x00, byte2 = undefined) {
        super(new.target._getValue(value, byte2));
    }

    /**
     * @param {number|Byte} byte1
     * @param {undefined|Byte} byte2
     * @returns {number}
     * @private
     */
    static _getValue(byte1, byte2) {
        if (byte2 === undefined) {
            if (!Number.isInteger(byte1) && !(byte1 instanceof Word)) {
                throw new Error('Word must be constructed from one value or two bytes');
            }
            return byte1;
        }

        if (!(byte1 instanceof Byte) || !(byte2 instanceof Byte)) {
            throw new Error('Word must be constructed from one value or two bytes');
        }

        return (parseInt(byte1) * 0x100) + parseInt(byte2);
    }
};
