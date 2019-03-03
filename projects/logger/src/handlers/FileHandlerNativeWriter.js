const FileHandlerWriter = require('./FileHandlerWriter');
const fs = require('fs');

module.exports = class FileHandlerNativeWriter extends FileHandlerWriter {
    /**
     * @override
     */
    write(file, data, options) {
        fs.writeFileSync(file, Buffer.from(data, 'utf8'), options);
    }
};
