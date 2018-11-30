const Definition = require('../InstructionSet/Definition');
const Memory = require('../../../ProcessorInterfaces/Memory');
const Word = require('../../../DataTypes/Word');
const Stack = require('../Stack');

module.exports = class Pushmb extends Definition {
    /**
     * @inheritDoc
     */
    static getDependencies() {
        return [Memory, Stack];
    }

    /**
     * @param {Memory} memory
     * @param {Stack} stack
     */
    constructor(memory, stack) {
        super();
        this._memory = memory;
        this._stack = stack;
    }

    /**
     * @inheritDoc
     */
    exec(byte2, byte3, byte4) {
        const value = this._memory.read(new Word(byte2, byte3));
        this._stack.push(value);
    }
};
