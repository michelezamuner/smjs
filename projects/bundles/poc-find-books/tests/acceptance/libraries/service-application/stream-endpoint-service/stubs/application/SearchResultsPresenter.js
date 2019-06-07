module.exports = class SearchResultsPresenter {
    constructor() {
        if (new.target === SearchResultsPresenter) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @param {Object} response 
     */
    present(response) {
        throw 'Not implemented';
    }
};