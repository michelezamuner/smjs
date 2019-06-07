module.exports = class SearchResultsAdapter {
    constructor() {
        if (new.target === SearchResultsAdapter) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @param {string} response 
     */
    write(response) {
        throw 'Not implemented';
    }

    close() {
        throw 'Not implemented';
    }
};