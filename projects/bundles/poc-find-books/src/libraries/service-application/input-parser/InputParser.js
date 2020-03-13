const _package = 'FindBooks.ServiceApplication.InputParser.';

const ServiceRequest = require('./ServiceRequest');
const InputParserException = require('./InputParserException');

/**
 * @interface
 */
module.exports = class InputParser {
    static toString() { return _package + InputParser.name; }

    constructor() {
        if (new.target === InputParser) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @param {string} input
     * @return {ServiceRequest}
     * @throws {InputParserException}
     */
    parse(input) {
        throw 'Not implemented';
    }
};
