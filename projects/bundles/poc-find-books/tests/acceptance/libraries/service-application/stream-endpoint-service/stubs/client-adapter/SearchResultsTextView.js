const SearchResultsView = require('./SearchResultsView');
const SearchResultsAdapter = require('./SearchResultsAdapter');

module.exports = class SearchResultsTextView extends SearchResultsView {
    static get __DEPS__() { return [ SearchResultsAdapter ]; }

    /**
     * @param {SearchResultsAdapter} adapter 
     */
    constructor(adapter) {
        super();
        this._adapter = adapter;
    }

    /**
     * @override
     */
    render(viewModel) {
        this._adapter.write(viewModel.response);
    }
};