const Interpreter = require('../ProcessorArchitecture/Interpreter');
const ControlRegisters = require('../ProcessorArchitecture/ControlRegisters');
const Byte = require('../DataTypes/Byte');

/**
 * Processor, interpreting instructions.
 */
module.exports = class Processor {
    /**
     * @param {Interpreter} interpreter
     * @param {ControlRegisters} registers
     */
    constructor(interpreter, registers) {
        this._interpreter = interpreter;
        this._registers = registers;
    }

    /**
     * Run the processor, interpreting the given instructions, and returning the program's exit status.
     *
     * @param {Byte[]} bytes
     * @return {number}
     */
    run(bytes) {
        let exitStatus = 0;
        let instruction = [];
        let byteIndex = 0;

        while (true) {
            if (bytes.length <= this._registers.getIp().toInt()) {
                exitStatus = 0;
                break;
            }

            if (instruction.length < this._registers.getIs()) {
                instruction.push(bytes[this._registers.getIp().toInt() + byteIndex]);
                byteIndex++;
                continue;
            }

            const exit = this._interpreter.exec(instruction);
            if (exit.shouldExit()) {
                exitStatus = exit.getExitStatus().toInt();
                break;
            }
            this._registers.incrementIp();
            instruction = [];
            byteIndex = 0;
        }

        return exitStatus;
    }
};
