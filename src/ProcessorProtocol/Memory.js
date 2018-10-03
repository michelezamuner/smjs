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
     * Read the byte at the given address.
     *
     * @param {DataType} address
     * @return {Byte}
     */
    read(address) {
        throw 'Not implemented';
    }

    /**
     * Read a set of bytes of the given size, at the given address.
     *
     * @param {DataType} address
     * @param {DataType} size
     * @return {Byte[]}
     */
    readSet(address, size) {
        throw 'Not implemented';
    }

    /**
     * Write the given byte at the given address.
     *
     * @param {DataType} address
     * @param {Byte} value
     */
    write(address, value) {
        throw 'Not implemented';
    }
};
