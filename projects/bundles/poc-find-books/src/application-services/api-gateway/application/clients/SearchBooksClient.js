const SearchBooksRequest = require('../../../../domain/api-gateway/SearchBooksRequest');

/**
 * @interface
 */
module.exports = class ApiGateway_Application_Clients_SearchBooksClient {
    constructor() {
        if (new.target === ApiGateway_Application_Clients_SearchBooksClient) {
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
