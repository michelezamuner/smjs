const Registers = require('../Registers');

/**
 * @interface
 */
module.exports = class RegistersProvider {
    /**
     * @return {Registers}
     * @abstract
     */
    getRegisters() {
        throw 'Not implemented';
    }
};
