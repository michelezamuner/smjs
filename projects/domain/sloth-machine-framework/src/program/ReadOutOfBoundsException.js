const _package = 'SlothMachine.SlothMachineFramework.Program.';

/**
 * Thrown when the size of data being read from the program goes out of the program's bounds.
 */
module.exports = class ReadOutOfBoundsException extends Error {
    static toString() { return _package + ReadOutOfBoundsException.name; }
};
