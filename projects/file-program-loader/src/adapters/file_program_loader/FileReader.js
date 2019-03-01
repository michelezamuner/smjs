const FileReaderException = require('./FileReaderException');

/**
 * @interface
 */
module.exports = class Adapters_FileProgramLoader_FileReader {
    constructor() {
        if (new.target === Adapters_FileProgramLoader_FileReader) {
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
