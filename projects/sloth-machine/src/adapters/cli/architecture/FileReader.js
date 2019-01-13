const FileReaderException = require('./FileReaderException');

module.exports = class FileReader {
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
