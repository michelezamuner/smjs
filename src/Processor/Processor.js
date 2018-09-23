const Registers = require('./Registers');

/**
 * Processor, interpreting instructions.
 */
module.exports = class Processor {
    /**
     * @param {InstructionSet} instructionSet
     * @param {Registers} registers
     */
    constructor(instructionSet, registers) {
        this._instructionSet = instructionSet;
        this._registers = registers;
    }

    /**
     * Run the processor, interpreting the given instructions, and returning the program's exit status.
     *
     * @param {Object[]} instructions
     * @return {number}
     */
    run(instructions) {
        while (true) {
            if (this._registers.getStatus(Registers.REG_ESC) !== undefined) {
                break;
            }
            if (instructions.length <= this._registers.ip) {
                this._registers.setStatus(Registers.REG_ESC, 0);
                break;
            }

            const instruction = instructions[this._registers.ip++];
            this._instructionSet[instruction.opcode](instruction.operands, this._registers);
        }

        return this._registers.getStatus(Registers.REG_ESC);
    }
};
