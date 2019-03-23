const Handler = require('../Handler');
const Console = require('console-wrapper').Console;
const LoggerException = require('../LoggerException');

module.exports = class Logger_Handlers_ConsoleHandler extends Handler {
    static get STREAM_STDOUT() { return 0; }
    static get STREAM_STDERR() { return 1; }

    /**
     * @param {Console} console
     * @param {number} stream
     */
    constructor(console, stream = Logger_Handlers_ConsoleHandler.STREAM_STDOUT) {
        super();
        if (stream !== Logger_Handlers_ConsoleHandler.STREAM_STDOUT && stream !== Logger_Handlers_ConsoleHandler.STREAM_STDERR) {
            throw new LoggerException('Invalid console handler stream');
        }
        this._console = console;
        this._stream = stream;
    }

    /**
     * @override
     */
    handle(message) {
        if (this._stream === Logger_Handlers_ConsoleHandler.STREAM_STDERR) {
            this._console.writeError(message);
        }

        this._console.write(message);
    }
};
