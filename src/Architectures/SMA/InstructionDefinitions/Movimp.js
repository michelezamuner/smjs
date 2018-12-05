const Definition = require('../InstructionSet/Definition');
const Memory = require('../../../ProcessorInterfaces/Memory');
const Word = require('../../../DataTypes/Word');

/**
 * @implements Definition
 */
module.exports = class Movimp extends Definition {
    /**
     * @inheritDoc
     */
    static getDependencies() {
        return [Memory];
    }

    /**
     * @param {Memory} memory
     */
    constructor(memory) {
        super();
        this._memory = memory;
    }

    /**
     * @inheritDoc
     */
    exec(byte2, byte3, byte4) {
        const address = new Word(byte2, byte3);
        const actual = new Word(...this._memory.readSet(address, Word.SIZE));
        this._memory.write(actual, byte4);
    }
};
