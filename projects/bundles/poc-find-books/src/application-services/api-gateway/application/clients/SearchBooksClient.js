const _package = 'FindBooks.ApiGateway.Clients.';

const SearchBooksRequest = require('../../../../domain/api/SearchBooksRequest');

/**
 * @interface
 */
module.exports = class SearchBooksClient {
    static toString() { return _package + SearchBooksClient.name; }
    constructor() {
        if (new.target === SearchBooksClient) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @param {SearchBooksRequest} endpoint
     */
    send(endpoint) {
        throw 'Not implemented';
    }
};
