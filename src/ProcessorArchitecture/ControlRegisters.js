const DataType = require('../DataTypes/DataType');

/**
 * @interface
 */
module.exports = class ControlRegisters {
    /**
     * Get the size of an instruction as a number of Bytes.
     *
     * @return {number}
     * @abstract
     */
    getIs() {
        throw 'Not implemented';
    }

    /**
     * Get the current instruction pointer.
     *
     * @return {DataType}
     * @abstract
     */
    getIp() {
        throw 'Not implemented';
    }

    /**
     * Increment the current instruction pointer.
     *
     * @abstract
     */
    incrementIp() {
        throw 'Not implemented';
    }
};
