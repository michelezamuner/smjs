const FileReader = require('./FileReader');
const FileReaderException = require('./FileReaderException');
const fs = require('fs');

module.exports = class NativeFileReader extends FileReader {
    /**
     * @override
     */
    read(file, options) {
        try {
            return fs.readFileSync(file, options);
        } catch (e) {
            throw new FileReaderException(e);
        }
    }
};
