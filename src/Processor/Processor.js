const Interpreter = require('../Interpreter/Interpreter');
const ControlRegisters = require('../../src/ProcessorArchitecture/ControlRegisters');
const Byte = require('./DataTypes/Byte');

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
            if (this._registers.shouldExit()) {
                exitStatus = this._registers.getEs().get();
                break;
            }
            if (bytes.length <= this._registers.getIp().get()) {
                exitStatus = 0;
                break;
            }

            if (instruction.length < this._registers.getIs()) {
                instruction.push(bytes[this._registers.getIp().get() + byteIndex])
                byteIndex++;
                continue;
            }

            this._interpreter.exec(instruction);
            this._registers.incrementIp();
            instruction = [];
            byteIndex = 0;
        }

        return exitStatus;
    }
};
