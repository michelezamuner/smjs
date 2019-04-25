const _package = 'Logger.Handlers.';

const Handler = require('../Handler');
const Console = require('console-wrapper').Console;
const LoggerException = require('../LoggerException');

module.exports = class ConsoleHandler extends Handler {
    static get STREAM_STDOUT() { return 0; }
    static get STREAM_STDERR() { return 1; }
    static toString() { return _package + ConsoleHandler.name; }

    /**
     * @param {Console} console
     * @param {number} stream
     */
    constructor(console, stream = ConsoleHandler.STREAM_STDOUT) {
        super();
        if (stream !== ConsoleHandler.STREAM_STDOUT && stream !== ConsoleHandler.STREAM_STDERR) {
            throw new LoggerException('Invalid console handler stream');
        }
        this._console = console;
        this._stream = stream;
    }

    /**
     * @override
     */
    handle(message) {
        if (this._stream === ConsoleHandler.STREAM_STDERR) {
            this._console.writeError(message);
        }

        this._console.write(message);
    }
};
