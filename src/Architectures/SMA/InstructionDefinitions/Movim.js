const Definition = require('../InstructionSet/Definition');
const MemoryProvider = require('../InstructionSet/MemoryProvider');
const Word = require('../../../DataTypes/Word');

/**
 * @implements Definition
 */
module.exports = class Movim extends Definition {
    /**
     * @param {MemoryProvider} provider
     */
    constructor(provider) {
        super();
        this._memory = provider.getMemory();
    }

    /**
     * @inheritDoc
     */
    exec(byte2, byte3, byte4) {
        this._memory.write(new Word(byte2, byte3), byte4);
    }
};
