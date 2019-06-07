module.exports = class SearchBooksView {
    constructor() {
        if (new.target === SearchBooksView) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @param {Object} viewModel 
     */
    render(viewModel) {
        throw 'Not implemented';
    }
};