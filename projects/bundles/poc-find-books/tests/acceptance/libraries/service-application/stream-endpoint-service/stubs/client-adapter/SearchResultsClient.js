module.exports = class SearchResultsClient {
    constructor() {
        if (new.target === SearchResultsClient) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @param {string} response 
     */
    send(response) {
        throw 'Not implemented';
    }

    close() {
        throw 'Not implemented';
    }
};