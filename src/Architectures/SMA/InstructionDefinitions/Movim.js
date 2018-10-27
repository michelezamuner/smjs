const Definition = require('../InstructionSet/Definition');
const Memory = require('../../../ProcessorInterfaces/Memory');
const Word = require('../../../DataTypes/Word');

/**
 * @implements Definition
 */
module.exports = class Movim extends Definition {
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
        this._memory.write(new Word(byte2, byte3), byte4);
    }
};
