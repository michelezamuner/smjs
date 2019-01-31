const Interpreter = require('sloth-machine-framework').Interpreter;
const Processor = require('sloth-machine-framework').Processor;

module.exports = class ProcessorFactory {
    /**
     * @param {Interpreter} interpreter
     * @return {Processor}
     */
    create(interpreter) {
        return new Processor(interpreter);
    }
};
