const _package = 'SlothMachine.VirtualMachine.RunProgram.';

/**
 * Thrown when the given request is missing the program reference.
 */
module.exports = class MissingProgramReferenceException extends Error {
    static toString() { return _package + MissingProgramReferenceException.name; }
};
