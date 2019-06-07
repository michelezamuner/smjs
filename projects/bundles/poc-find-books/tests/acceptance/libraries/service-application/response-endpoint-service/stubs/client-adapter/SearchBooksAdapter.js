module.exports = class SearchBooksAdapter {
    constructor() {
        if (new.target === SearchBooksAdapter) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @param {string} response 
     */
    respond(response) {
        throw 'Not implemented';
    }
};