const DataType = require('../DataTypes/DataType');

/**
 * @interface
 */
module.exports = class ControlRegisters {
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
};
