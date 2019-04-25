const _package = 'Logger.';

/**
 * Thrown when an error happens while using the logger
 */
module.exports = class LoggerException extends Error {
    static toString() { return _package + LoggerException.name; }
};
