module.exports = class SearchResultsView {
    constructor() {
        if (new.target === SearchResultsView) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @param {Object} viewModel 
     */
    renderResults(viewModel) {
        throw 'Not implemented';
    }
};