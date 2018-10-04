const DataType = require('./DataType');
const Byte = require('./Byte');

module.exports = class Double extends DataType {
    /**
     * @inheritDoc
     */
    static get MAX() {
        return 0xFFFFFFFF;
    }

    /**
     * @param {number|Double|Byte} value
     * @param {Byte=} byte2
     * @param {Byte=} byte3
     * @param {Byte=} byte4
     */
    constructor(value, byte2 = undefined, byte3 = undefined, byte4 = undefined) {
        super(new.target._getValue(value, byte2, byte3, byte4));
    }

    /**
     * @returns {Byte[]}
     */
    toBytes() {
        return super._toBytes(4).map(value => new Byte(value));
    }

    /**
     * @param {Byte} byte1
     * @param {Byte} byte2
     * @param {Byte} byte3
     * @param {Byte} byte4
     * @returns {number}
     * @private
     */
    static _getValue(byte1, byte2, byte3, byte4) {
        if (byte2 === undefined && byte3 === undefined && byte4 === undefined) {
            if (!Number.isInteger(byte1) && !(byte1 instanceof Double)) {
                throw 'Double must be constructed from one value or four bytes';
            }
            return byte1;
        }

        if (!(byte1 instanceof Byte) || !(byte2 instanceof Byte) || !(byte3 instanceof Byte) || !(byte4 instanceof Byte)) {
            throw 'Double must be constructed from one value or four bytes';
        }

        return (byte1.toInt() * 0x1000000) + (byte2.toInt() * 0x10000) + (byte3.toInt() * 0x100) + byte4.toInt();
    }
};
