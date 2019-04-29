const _package = 'FindBooks.ServiceApplication.InputParser.';

const InputParser = require('./InputParser');
const ServiceRequest = require('./ServiceRequest');
const ServiceApplicationException = require('../ServiceApplicationException');

module.exports = class BasicInputParser extends InputParser {
    static toString() { return _package + BasicInputParser.name; }
    static get _FORMAT() { return /^\/([\w\-]+)\??((?:[\w\-]+=[\w\-+]+&?)+)?/; }

    /**
     * @param {string} input
     * @return {ServiceRequest}
     * @throws {ServiceApplicationException}
     */
    parse(input) {
        const match = BasicInputParser._FORMAT.exec(input);
        if (match === null) {
            throw new ServiceApplicationException(`Invalid input: "${input}"`);
        }

        return new ServiceRequest(match[1], this._parseParams(match[2]));
    }

    /**
     * @param string
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
            params[paramParts[0]] = paramParts[1].replace(/\+/g, ' ');
        }

        return params;
    }
};
