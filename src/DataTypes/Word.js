const DataType = require('./DataType');
const Byte = require('./Byte');

module.exports = class Word extends DataType {
    /**
     * @returns {number}
     */
    static get SIZE() {
        return 2;
    }

    /**
     * @param {number|Word|Byte} value
     * @param {Byte=} byte2
     */
    constructor(value, byte2 = undefined) {
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
                throw 'Word must be constructed from one value or two bytes';
            }
            return byte1;
        }

        if (!(byte1 instanceof Byte) || !(byte2 instanceof Byte)) {
            throw 'Word must be constructed from one value or two bytes';
        }

        return (byte1.toInt() * 256) + byte2.toInt();
    }

    /**
     * @inheritDoc
     */
    toSignedInt() {
        return super.constructor._toSignedInt(this.constructor.SIZE, this._value);
    }
};
