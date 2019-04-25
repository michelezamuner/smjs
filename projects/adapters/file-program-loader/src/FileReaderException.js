const _package = 'SlothMachine.FileProgramLoader.';

/**
 * Thrown when an error happens while reading a file.
 */
module.exports = class FileReaderException extends Error {
    static toString() { return _package + FileReaderException.name; }
};
