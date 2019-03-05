const Handler = require('./Handler');
const LoggerException = require('./LoggerException');
const TimeProvider = require('./TimeProvider');
const SimpleTimeProvider = require('./SimpleTimeProvider');

module.exports = class Logger_Logger {
    /**
     * @param {TimeProvider} time
     */
    constructor(time = new SimpleTimeProvider()) {
        this._time = time;
        this._handlers = [];
    }

    /**
     * @param {Handler} handler
     */
    addHandler(handler) {
        this._handlers.push(handler);
    }

    /**
     * @param {string} message
     * @throws {LoggerException}
     */
    log(message) {
        if (this._handlers.length === 0) {
            throw new LoggerException('No logger handler has been added');
        }

        for (const handler of this._handlers) {
            handler.handle(`[${this._time.now().toISOString()}] ${message}`);
        }
    }
};
