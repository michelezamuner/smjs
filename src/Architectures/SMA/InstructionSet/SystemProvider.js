const RegistersProvider = require('./RegistersProvider');
const MemoryProvider = require('./MemoryProvider');
const System = require('../System');

/**
 * @interface
 * @extends RegistersProvider
 * @extends MemoryProvider
 */
module.exports = class SystemProvider {
    /**
     * @return System
     * @abstract
     */
    getSystem() {
        throw 'Not implemented';
    }
};
