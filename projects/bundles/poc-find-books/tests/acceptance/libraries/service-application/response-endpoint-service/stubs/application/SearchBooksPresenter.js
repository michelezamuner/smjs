module.exports = class SearchBooksPresenter {
    constructor() {
        if (new.target === SearchBooksPresenter) {
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