const _package = 'FindBooks.ServiceApplication.InputParser.';

const InputParser = require('./InputParser');
const ServiceRequest = require('./ServiceRequest');
const InputParserException = require('./InputParserException');

module.exports = class BasicInputParser extends InputParser {
    static toString() { return _package + BasicInputParser.name; }
    static get _FORMAT() { return /^((?:[^\n:]+:[^\n]+\n?)+)?\/([\w\-\/]+)\??((?:[\w\-]+=[\w\-+]+&?)+)?/; }

    /**
     * @param {string} input
     * @return {ServiceRequest}
     * @throws {ServiceApplicationException}
     */
    parse(input) {
        const match = BasicInputParser._FORMAT.exec(input);
        if (match === null) {
            throw new InputParserException(`Invalid input: "${input}"`);
        }

        return new ServiceRequest(match[2], this._parseParams(match[3]), this._parseMeta(match[1]));
    }

    /**
     * @param {string} string
     * @return {Object}
     * @private
     */
    _parseParams(string) {
        if (string === undefined) {
            return {};
        }

        const params = {};
        const stringParts = string.split('&');
        for (const stringPart of stringParts) {
            const paramParts = stringPart.split('=');
            const value = paramParts[1].replace(/\+/g, ' ');
            const intValue = Number.parseInt(value);
            params[paramParts[0]] = isNaN(intValue) ? value : intValue;
        }

        return params;
    }

    /**
     * @param {string} string
     * @return {Object}
     * @private
     */
    _parseMeta(string) {
        if (string === undefined) {
            return {};
        }

        const meta = {};
        const stringParts = string.trim().split(/\n/);
        for (const stringPart of stringParts) {
            const metaParts = stringPart.split(':');
            const value = metaParts[1].trim();
            const intValue = Number.parseInt(value);
            meta[metaParts[0]] = isNaN(intValue) ? value : intValue;
        }

        return meta;
    }
};
