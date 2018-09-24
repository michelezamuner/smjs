const Registers = require('./Registers');

/**
 * Processor, interpreting instructions.
 */
module.exports = class Processor {
    /**
     * @param {Interpreter} interpreter
     * @param {Registers} registers
     */
    constructor(interpreter, registers) {
        this._interpreter = interpreter;
        this._registers = registers;
        this._registers.et = Registers.EXIT_TRIGGER_OFF;
        this._registers.es = Registers.EXIT_STATUS_OK;
    }

    /**
     * Run the processor, interpreting the given instructions, and returning the program's exit status.
     *
     * @param {Object[]} instructions
     * @return {number}
     */
    run(instructions) {
        while (true) {
            if (this._registers.et.equals(Registers.EXIT_TRIGGER_ON)) {
                break;
            }
            if (instructions.length <= this._registers.ip) {
                this._registers.es = Registers.EXIT_STATUS_OK;
                break;
            }
            
            this._interpreter.exec(instructions[this._registers.ip++]);
        }

        return this._registers.es.toInt();
    }
};
