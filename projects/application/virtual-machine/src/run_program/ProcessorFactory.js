const Interpreter = require('domain/sloth-machine-framework').interpreter.Interpreter;
const Processor = require('domain/sloth-machine-framework').processor.Processor;

module.exports = class VirtualMachine_RunProgram_ProcessorFactory {
    /**
     * @param {Interpreter} interpreter
     * @return {Processor}
     */
    create(interpreter) {
        return new Processor(interpreter);
    }
};
