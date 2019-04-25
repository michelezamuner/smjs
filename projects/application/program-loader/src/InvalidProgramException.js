const _package = 'SlothMachine.ProgramLoader.';

/**
 * Thrown when trying to load a program with an invalid reference.
 */
module.exports = class InvalidProgramException extends Error {
    static toString() { return _package + InvalidProgramException.name; }
};
