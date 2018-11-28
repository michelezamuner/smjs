const Definition = require('../InstructionSet/Definition');
const Registers = require('../Registers');
const Memory = require('../../../../src/ProcessorInterfaces/Memory');
const Stack = require('../Stack');
const Byte = require('../../../DataTypes/Byte');
const Word = require('../../../DataTypes/Word');
const Double = require('../../../DataTypes/Double');

module.exports = class Retmd extends Definition {
    /**
     * @inheritDoc
     */
    static getDependencies() {
        return [Registers, Memory, Stack];
    }

    /**
     * @param {Registers} registers
     * @param {Memory} memory
     * @param {Stack} stack
     */
    constructor(registers, memory, stack) {
        super();
        this._registers = registers;
        this._memory = memory;
        this._stack = stack;
    }

    /**
     * @inheritDoc
     */
    exec(byte2, byte3, byte4) {
        const value = new Double(...this._memory.readSet(new Word(byte2, byte3), new Byte(Double.SIZE)));
        this._registers.setIp(this._stack.popFrame());
        this._stack.push(value);
    }
};
