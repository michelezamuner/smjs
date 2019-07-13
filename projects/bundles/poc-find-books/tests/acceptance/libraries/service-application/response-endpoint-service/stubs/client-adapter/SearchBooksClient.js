module.exports = class SearchBooksClient {
    constructor() {
        if (new.target === SearchBooksClient) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @param {string} response 
     */
    send(response) {
        throw 'Not implemented';
    }
};