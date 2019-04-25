const _package = 'SlothMachine.SlothMachineFramework.Interpreter.';

/**
 * Thrown when an error happens while executing an instruction.
 */
module.exports = class InterpreterException extends Error {
    static toString() { return _package + InterpreterException.name; }
};
