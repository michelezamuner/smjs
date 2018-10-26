const DataType = require('../DataTypes/DataType');
const Byte = require('../DataTypes/Byte');

/**
 * @interface
 */
module.exports = class Registers {
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
     * Set the instruction pointer to the given value.
     *
     * @param {DataType} ip
     * @abstract
     */
    setIp(ip) {
        throw 'Not implemented';
    }

    /**
     * Tells whether the program should exit or not.
     *
     * @return {boolean}
     * @abstract
     */
    shouldExit() {
        throw 'Not implemented';
    }

    /**
     * Get the status the program should exit with.
     *
     * @return {Byte}
     * @abstract
     */
    getExitStatus() {
        throw 'Not implemented';
    }
};
