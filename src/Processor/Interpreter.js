const Registers = require('./Registers');
const Byte = require('./DataTypes/Byte');

/**
 * Interpreter of instructions
 */
module.exports = class Interpreter {
    /**
     * @returns {number}
     */
    static get SYS_EXIT() {
        return 1;
    }

    /**
     * @param {Registers} registers
     */
    constructor(registers) {
        this._registers = registers;
    }

    /**
     * @param {string} register
     * @param {number|string} value
     */
    mov([register, value]) {
        value = Registers.MAIN_REGISTERS.includes(value) ? this._registers.getMain(value) : value;
        this._registers.setMain(register, value);
    }

    /**
     * @param {array} []
     */
    syscall([]) {
        if (this._registers.getMain(Registers.REG_EAX).equals(new Byte(Interpreter.SYS_EXIT))) {
            this._registers.et = Registers.EXIT_TRIGGER_ON;
            this._registers.es = this._registers.getMain(Registers.REG_EBX);
        }
    }
};
