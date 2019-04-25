const _package = 'Logger.Handlers.';

const FileHandlerWriter = require('./FileHandlerWriter');
const fs = require('fs');

module.exports = class FileHandlerNativeWriter extends FileHandlerWriter {
    static toString() { return _package + FileHandlerNativeWriter.name; }

    /**
     * @override
     */
    write(file, data, options) {
        fs.writeFileSync(file, Buffer.from(data, 'utf8'), options);
    }
};
