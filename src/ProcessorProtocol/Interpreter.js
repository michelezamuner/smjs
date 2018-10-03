const Exit = require('./Exit');
const Byte = require('../../src/DataTypes/Byte');

/**
 * @interface
 */
module.exports = class Interpreter {
    /**
     * Get instruction size in bytes.
     *
     * @return {Byte}
     */
    getInstructionSize() {
        throw 'Not implemented';
    }

    /**
     * Execute the given set of bytes as an instruction, returning the exit context, telling whether to exit or not,
     * and with which status.
     *
     * @param {Byte[]} bytes
     * @return {Exit}
     */
    exec(bytes) {
        throw 'Not implemented';
    }
};
