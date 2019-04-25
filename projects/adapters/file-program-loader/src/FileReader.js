const _package = 'SlothMachine.FileProgramLoader.';

const FileReaderException = require('./FileReaderException');

/**
 * @interface
 */
module.exports = class FileReader {
    static toString() { return _package + FileReader.name; }

    constructor() {
        if (new.target === FileReader) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @param {string} file
     * @param {object} options
     * @return (string)
     * @throws {FileReaderException}
     */
    read(file, options) {
        throw 'Not implemented';
    }
};
