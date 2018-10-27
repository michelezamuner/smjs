const Byte = require('../../../DataTypes/Byte');

/**
 * @interface
 */
module.exports = class Definition {
    /**
     * @return {function[]}
     * @abstract
     */
    static getDependencies() {
        throw 'Not implemented';
    }

    /**
     * @param {Byte} byte1
     * @param {Byte} byte2
     * @param {Byte} byte3
     * @abstract
     */
    exec(byte1, byte2, byte3) {
        throw 'Not implemented';
    }
};
