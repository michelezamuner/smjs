const Definition = require('../InstructionSet/Definition');
const Stack = require('../Stack');
const Word = require('../../../DataTypes/Word');

module.exports = class Pushi extends Definition {
    /**
     * @inheritDoc
     */
    static getDependencies() {
        return [Stack];
    }

    /**
     * @param {Stack} stack
     */
    constructor(stack) {
        super();
        this._stack = stack;
    }

    /**
     * @inheritDoc
     */
    exec(byte2, byte3, byte4) {
        this._stack.push(new Word(byte2, byte3));
    }
};
