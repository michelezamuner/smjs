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

        // let max = 5;
        while (true) {
            // if (max-- < 0) break;
            if (!this._canIncrementIp()) {
                throw new MissingExitException('Missing exit instruction');
            }

            const instruction = this._memory.readSet(this._registers.getIp(), this._interpreter.getInstructionSize());
            const exit = this._interpreter.exec(instruction);

            if (exit.shouldExit()) {
                exitStatus = exit.getExitStatus().uint();
                break;
            }

            this._registers.setIp(this._registers.getIp().add(this._interpreter.getInstructionSize()));
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
