const Definition = require('../InstructionSet/Definition');
const Registers = require('../Registers');
const RegisterAddress = require('../RegisterAddress');
const Stack = require('../Stack');

module.exports = class Push extends Definition {
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
        const registerAddress = new RegisterAddress(byte2);
        const value = this._registers.get(registerAddress);
        this._stack.push(value);
    }
};
