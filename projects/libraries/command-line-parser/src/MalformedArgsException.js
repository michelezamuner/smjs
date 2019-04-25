const _package = 'CommandLineParser.';

/**
 * Thrown when malformed command line arguments are given.
 */
module.exports = class MalformedArgsException extends Error {
    static toString() { return _package + MalformedArgsException.name; }
};
