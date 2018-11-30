const Definition = require('../InstructionSet/Definition');
const Memory = require('../../../ProcessorInterfaces/Memory');
const Byte = require('../../../DataTypes/Byte');
const Word = require('../../../DataTypes/Word');
const Stack = require('../Stack');

module.exports = class Pushmw extends Definition {
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
        const bytes = this._memory.readSet(new Word(byte2, byte3), new Byte(Word.SIZE));
        const value = new Word(...bytes);
        this._stack.push(value);
    }
};
