const _package = 'SlothMachine.FileProgramLoader.';

const FileReader = require('./FileReader');
const FileReaderException = require('./FileReaderException');
const fs = require('fs');

module.exports = class NativeFileReader extends FileReader {
    static toString() { return _package + NativeFileReader.name; }

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
