const SearchResultsView = require('./SearchResultsView');
const SearchResultsClient = require('./SearchResultsClient');

module.exports = class SearchResultsTextView extends SearchResultsView {
    static get __DEPS__() { return [ SearchResultsClient ]; }

    /**
     * @param {SearchResultsClient} client
     */
    constructor(client) {
        super();
        this._client = client;
    }

    /**
     * @override
     */
    render(viewModel) {
        this._client.send(viewModel.response);
    }
};