const Interpreter = require('../ProcessorArchitecture/Interpreter');
const ControlRegisters = require('../ProcessorArchitecture/ControlRegisters');
const Byte = require('../DataTypes/Byte');
const Double = require('../DataTypes/Double');

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
                exitStatus = this._registers.getEs().toInt();
                break;
            }
            if (bytes.length <= this._registers.getIp().toInt()) {
                exitStatus = 0;
                break;
            }

            if (instruction.length < this._registers.getIs()) {
                instruction.push(bytes[this._registers.getIp().toInt() + byteIndex])
                byteIndex++;
                continue;
            }

            this._registers.setIr(new Double(...instruction));
            this._interpreter.exec();
            this._registers.incrementIp();
            instruction = [];
            byteIndex = 0;
        }

        return exitStatus;
    }
};
