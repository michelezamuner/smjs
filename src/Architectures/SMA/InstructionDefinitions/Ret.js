const Definition = require('../InstructionSet/Definition');
const Registers = require('../Registers');
const Stack = require('../Stack');

module.exports = class Ret extends Definition {
    /**
     * @inheritDoc
     */
    static getDependencies() {
        return [Registers, Stack];
    }

    /**
     * @param {Registers} registers
     * @param {Stack} stack
     */
    constructor(registers, stack) {
        super();
        this._registers = registers;
        this._stack = stack;
    }

    /**
     * @inheritDoc
     */
    exec(byte2, byte3, byte4) {
        this._registers.setIp(this._stack.popFrame());
    }
};
