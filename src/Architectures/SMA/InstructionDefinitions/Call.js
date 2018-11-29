const Definition = require('../InstructionSet/Definition');
const Registers = require('../Registers');
const Stack = require('../Stack');
const Word = require('../../../DataTypes/Word');

module.exports = class Call extends Definition {
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
        const procedureAddress = new Word(byte2, byte3);
        const returnAddress = this._registers.getIp();

        this._stack.pushFrame(returnAddress);
        this._registers.setIp(procedureAddress);
    }
};
