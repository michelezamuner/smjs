const Memory = require('../../../ProcessorInterfaces/Memory');

/**
 * @interface
 */
module.exports = class MemoryProvider {
    /**
     * @return Memory
     * @abstract
     */
    getMemory() {
        throw 'Not implemented';
    }
};
