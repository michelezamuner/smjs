const SearchCompleteView = require('./SearchCompleteView');
const SearchResultsAdapter = require('./SearchResultsAdapter');

module.exports = class SearchCompleteEmptyView extends SearchCompleteView {
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
    render() {
        this._adapter.close();
    }
};