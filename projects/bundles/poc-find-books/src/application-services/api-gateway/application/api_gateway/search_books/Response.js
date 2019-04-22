const SearchBookResponse = require('../../../../../domain/api-gateway/SearchBooksResponse');

module.exports = class ApiGateway_Application_ApiGateway_SearchBooks_Response {
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
