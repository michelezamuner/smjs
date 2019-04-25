const _package = 'FindBooks.ApiGateway.ApiGateway.SearchBooks.';

const SearchBookResponse = require('../../../../../domain/api/SearchBooksResponse');

module.exports = class Response {
    static toString() { return _package + Response.name; }

    /**
     * @param {SearchBookResponse} response
     */
    constructor(response) {
        this._response = response;
    }

    /**
     * @return {SearchBookResponse}
     */
    getSearchBooksResponse() {
        return this._response;
    }
};
