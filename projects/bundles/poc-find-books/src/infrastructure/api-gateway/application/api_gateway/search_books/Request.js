const _package = 'FindBooks.ApiGateway.ApiGateway.SearchBooks.';

const SearchBooksRequest = require('../../../../../domain/api/SearchBooksRequest');

/**
 * @interface
 */
module.exports = class Request {
    static toString() { return _package + Request.name; }
    constructor() {
        if (new.target === Request) {
            throw 'Cannot implement interface';
        }
    }

    /**
     * @return {SearchBooksRequest}
     */
    getSearchBooksRequest() {
        throw 'Not implemented';
    }
};
