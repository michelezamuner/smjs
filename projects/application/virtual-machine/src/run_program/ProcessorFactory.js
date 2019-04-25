const _package = 'SlothMachine.VirtualMachine.RunProgram.';

const Interpreter = require('domain/sloth-machine-framework').interpreter.Interpreter;
const Processor = require('domain/sloth-machine-framework').processor.Processor;

module.exports = class ProcessorFactory {
    static toString() { return _package + ProcessorFactory.name; }

    /**
     * @param {Interpreter} interpreter
     * @return {Processor}
     */
    create(interpreter) {
        return new Processor(interpreter);
    }
};
