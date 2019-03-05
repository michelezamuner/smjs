const Handler = require('../Handler');
const FileHandlerWriter = require('./FileHandlerWriter');
const FileHandlerNativeWriter = require('./FileHandlerNativeWriter');

module.exports = class Logger_Handlers_FileHandler extends Handler {
    /**
     * @param {string} file
     * @param {FileHandlerWriter} writer
     */
    constructor(file, writer = new FileHandlerNativeWriter()) {
        super();
        this._file = file;
        this._writer = writer;
    }

    /**
     * @override
     */
    handle(message) {
        this._writer.write(this._file, message + '\n', {encoding: 'utf8', flag: 'as'});
    }
};
