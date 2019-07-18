module.exports = class SearchBooksView {
    constructor() {
        if (new.target === SearchBooksView) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @param {Object} viewModel 
     */
    renderResponse(viewModel) {
        throw 'Not implemented';
    }
};