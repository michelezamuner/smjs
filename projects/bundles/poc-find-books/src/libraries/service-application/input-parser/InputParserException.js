const _package = 'FindBooks.ServiceApplication.InputParser.';

/**
 * Thrown when an error happens while parsing the input.
 */
module.exports = class InputParserException extends Error {
    static toString() { return _package + InputParserException.name; }
};