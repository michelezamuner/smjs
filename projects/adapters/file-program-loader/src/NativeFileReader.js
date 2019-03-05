const FileReader = require('./FileReader');
const FileReaderException = require('./FileReaderException');
const fs = require('fs');

module.exports = class FileProgramLoader_NativeFileReader extends FileReader {
    /**
     * @override
     */
    read(file, options) {
        try {
            return fs.readFileSync(file, options);
        } catch (e) {
            if (e.message.startsWith('ENOENT: no such file or directory')) {
                throw new FileReaderException();
            }

            throw e;
        }
    }
};
