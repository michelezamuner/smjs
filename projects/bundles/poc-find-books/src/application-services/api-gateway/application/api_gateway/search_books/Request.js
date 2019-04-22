const SearchBooksRequest = require('../../../../../domain/api-gateway/SearchBooksRequest');

/**
 * @interface
 */
module.exports = class ApiGateway_Application_ApiGateway_SearchBooks_Request {
    constructor() {
        if (new.target === ApiGateway_Application_ApiGateway_SearchBooks_Request) {
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
