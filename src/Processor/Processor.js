const Interpreter = require('../ProcessorInterfaces/Interpreter');
const ControlRegisters = require('../ProcessorInterfaces/Registers');
const Memory = require('../ProcessorInterfaces/Memory');
const MissingExitException = require('./MissingExitException');

/**
 * Processor, interpreting instructions.
 */
module.exports = class Processor {
    /**
     * @param {Interpreter} interpreter
     * @param {ControlRegisters} registers
     * @param {Memory} memory
     */
    constructor(interpreter, registers, memory) {
        this._interpreter = interpreter;
        this._registers = registers;
        this._memory = memory;
    }

    /**
     * Run the processor, interpreting instructions read from memory, and returning the program's exit status.
     *
     * @return {number}
     */
    run() {
        let exitStatus = 0;

        while (true) {
            if (!this._canIncrementIp()) {
                throw new MissingExitException('Missing exit instruction');
            }

            const instruction = this._memory.read(this._registers.getIp(), this._interpreter.getInstructionSize());
            this._registers.setIp(this._registers.getIp().add(this._interpreter.getInstructionSize()));

            this._interpreter.exec(instruction);
            if (this._registers.shouldExit()) {
                exitStatus = parseInt(this._registers.getExitStatus());
                break;

            }
        }

        return exitStatus;
    }

    /**
     * @returns {boolean}
     * @private
     */
    _canIncrementIp() {
        try {
            this._registers.getIp().add(this._interpreter.getInstructionSize());
            return true;
        } catch (e) {
            return false;
        }
    }
};
