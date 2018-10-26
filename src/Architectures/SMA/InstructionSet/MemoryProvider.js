const Memory = require('../../../ProcessorInterfaces/Memory');

/**
 * @interface
 */
module.exports = class MemoryProvider {
    /**
     * @return Memory
     */
    getMemory() {
        throw 'Not implemented';
    }
};
