const SearchCompleteView = require('./SearchCompleteView');
const SearchResultsClient = require('./SearchResultsClient');

module.exports = class SearchCompleteEmptyView extends SearchCompleteView {
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
    render() {
        this._client.close();
    }
};