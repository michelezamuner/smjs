const Interpreter = require('../ProcessorArchitecture/Interpreter');
const ControlRegisters = require('../ProcessorArchitecture/ControlRegisters');
const Memory = require('../ProcessorArchitecture/Memory');

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
            const instruction = this._memory.readSet(this._registers.getIp(), this._registers.getIs());
            const exit = this._interpreter.exec(instruction);

            if (exit.shouldExit()) {
                exitStatus = exit.getExitStatus().toInt();
                break;
            }

            this._registers.incrementIp();
        }

        return exitStatus;
    }
};
