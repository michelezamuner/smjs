const _package = 'SlothMachine.SlothMachineFramework.Processor.';

const Program = require('../program/Program');
const InvalidAddressException = require('../program/InvalidAddressException');
const ReadOutOfBoundsException = require('../program/ReadOutOfBoundsException');
const ProcessorException = require('./ProcessorException');
const Address = require('../data/Address');
const Interpreter = require('../interpreter/Interpreter');
const InterpreterException = require('../interpreter/InterpreterException');
const Opcode = require('../interpreter/Opcode');
const Operands = require('../interpreter/Operands');
const Instruction = require('../interpreter/Instruction');

module.exports = class Processor {
    static toString() { return _package + Processor.name; }

    /**
     * @param {Interpreter} interpreter
     */
    constructor(interpreter) {
        this._interpreter = interpreter;
    }

    /**
     * @param {Program} program
     * @return {ExitStatus}
     * @throws {ProcessorException}
     */
    run(program) {
        const opcodeSize = this._interpreter.getOpcodeSize();
        let address = new Address();

        while (true) {
            try {
                const opcode = new Opcode(program.read(address, opcodeSize));
                const operandsSize = this._interpreter.getOperandsSize(opcode);
                const operandsAddress = address.add(opcodeSize);
                const operands = new Operands(program.read(operandsAddress, operandsSize));
                const instruction = new Instruction(address, opcode, operands);

                const status = this._interpreter.exec(instruction);
                if (status.shouldExit()) {
                    return status.getExitStatus();
                }
                address = status.shouldJump() ? status.getJumpAddress() : operandsAddress.add(operandsSize);
            } catch (e) {
                if (
                    e instanceof InvalidAddressException ||
                    e instanceof ReadOutOfBoundsException ||
                    e instanceof InterpreterException
                ) {
                    throw new ProcessorException(e.message);
                }
                throw e;
            }
        }
    }
};
