const Registers = require('./Registers');
const Byte = require('./DataTypes/Byte');

/**
 * Instruction set of an interpreter.
 */
module.exports = class InstructionSet {
    /**
     * @returns {number}
     */
    static get SYS_EXIT() {
        return 1;
    }

    /**
     * @param {string} register
     * @param {number|string} value
     * @param {Registers} registers
     */
    mov([register, value], registers) {
        value = Registers.MAIN_REGISTERS.includes(value) ? registers.getMain(value) : value;
        registers.setMain(register, value);
    }

    /**
     * @param {array} []
     * @param {Registers} registers
     */
    syscall([], registers) {
        if (registers.getMain(Registers.REG_EAX).equals(new Byte(InstructionSet.SYS_EXIT))) {
            registers.et = Registers.EXIT_TRIGGER_ON;
            registers.es = registers.getMain(Registers.REG_EBX);
        }
    }
};
