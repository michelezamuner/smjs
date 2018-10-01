const DataType = require('../DataTypes/DataType');
const Byte = require('../DataTypes/Byte');

/**
 * @interface
 */
module.exports = class Memory {
    /**
     * Get the maximum number of Bytes addressable by this memory.
     *
     * @return {number}
     */
    getSize() {
        throw 'Not implemented';
    }

    /**
     * Read the byte at the given address.
     *
     * @param {number} address
     * @return {Byte}
     */
    read(address) {
        throw 'Not implemented';
    }

    /**
     * Read a set of bytes of the given size, at the given address.
     *
     * @param {number} address
     * @param {number} size
     * @return {Byte[]}
     */
    readSet(address, size) {
        throw 'Not implemented';
    }

    /**
     * Write the given byte at the given address.
     *
     * @param {number} address
     * @param {Byte} value
     */
    write(address, value) {
        throw 'Not implemented';
    }
};
