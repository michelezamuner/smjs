const Definition = require('../InstructionSet/Definition');
const MemoryProvider = require('../InstructionSet/MemoryProvider');
const Byte = require('../../../DataTypes/Byte');
const Word = require('../../../DataTypes/Word');

/**
 * @implements Definition
 */
module.exports = class Movimp extends Definition {
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
        const address = new Word(byte2, byte3);
        const actual = new Word(...this._memory.readSet(address, new Byte(0x02)));
        this._memory.write(actual, byte4);
    }
};
