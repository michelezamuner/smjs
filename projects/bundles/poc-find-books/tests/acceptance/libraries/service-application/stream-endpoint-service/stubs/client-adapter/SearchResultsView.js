module.exports = class SearchResultsView {
    constructor() {
        if (new.target === SearchResultsView) {
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