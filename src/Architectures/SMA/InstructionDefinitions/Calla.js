const Definition = require('../InstructionSet/Definition');
const Registers = require('../Registers');
const Stack = require('../Stack');
const Word = require('../../../DataTypes/Word');
const Byte = require('../../../DataTypes/Byte');

module.exports = class Calla extends Definition {
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

        const argumentsBytes = this._popArgumentsBytes(parseInt(byte4));
        this._stack.pushFrame(returnAddress);
        this._pushArgumentsBytes(argumentsBytes);

        this._registers.setIp(procedureAddress);
    }

    /**
     * @param {number} size
     * @return {Byte[]}
     * @private
     */
    _popArgumentsBytes(size) {
        const argumentsBytes = [];
        for (let i = 0; i < size; i++) {
            argumentsBytes[i] = this._stack.pop(Byte);
        }

        return argumentsBytes;
    }

    /**
     * @param {Byte[]} bytes
     * @private
     */
    _pushArgumentsBytes(bytes) {
        // Bytes have been popped in reverse order, so we need to reverse them to exactly copy their original layout
        for (const byte of bytes.reverse()) {
            this._stack.push(byte);
        }
    }
};
