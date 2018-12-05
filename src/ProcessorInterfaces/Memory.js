const DataType = require('../DataTypes/DataType');
const Byte = require('../DataTypes/Byte');

/**
 * @interface
 */
module.exports = class Memory {
    /**
     * Get the maximum address available in this memory.
     *
     * @return {DataType}
     */
    getMax() {
        throw 'Not implemented';
    }

    /**
     * Read a set of bytes of the given size located at the given address.
     *
     * @param {DataType} address
     * @param {DataType} size
     * @return {Byte[]}
     */
    read(address, size) {
        throw 'Not implemented';
    }

    /**
     * Write the given value at the given address.
     *
     * @param {DataType} address
     * @param {DataType|Byte[]} value
     */
    write(address, value) {
        throw 'Not implemented';
    }
};
