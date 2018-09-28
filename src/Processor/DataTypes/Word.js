const DataType = require('./DataType');
const Byte = require('./Byte');

module.exports = class Word extends DataType {
    /**
     * @returns {number}
     */
    static get MAX() {
        return 65535;
    }

    /**
     * @param {number|Word|Byte} value
     * @param {Byte|undefined} second
     */
    constructor(value, second = undefined) {
        super(Word._parseValue(value, second));
    }

    /**
     * @param {number|Byte} first
     * @param {undefined|Byte} second
     * @returns {number}
     * @private
     */
    static _parseValue(first, second) {
        if (second === undefined) {
            if (!Number.isInteger(first)) {
                throw 'Word must be constructed with one integer or two bytes';
            }
            return first;
        }

        if (!(first instanceof Byte) || !(second instanceof Byte)) {
            throw 'Word must be constructed with one integer or two bytes';
        }

        return (first.get() << 8) + second.get();
    }
};
