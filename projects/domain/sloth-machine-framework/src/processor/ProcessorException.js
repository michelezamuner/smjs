const _package = 'SlothMachine.SlothMachineFramework.Processor.';

/**
 * Thrown when an error happen while a program is being run.
 */
module.exports = class ProcessorException extends Error {
    static toString() { return _package + ProcessorException.name; }
};
