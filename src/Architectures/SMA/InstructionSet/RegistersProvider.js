const Registers = require('../Registers');

/**
 * @interface
 */
module.exports = class RegistersProvider {
    /**
     * @return {Registers}
     */
    getRegisters() {
        throw 'Not implemented';
    }
};
