const SearchBooksView = require('./SearchBooksView');
const SearchBooksClient = require('./SearchBooksClient');

module.exports = class SearchBooksJsonView extends SearchBooksView {
    static get __DEPS__() { return [ SearchBooksClient ]; }

    /**
     * @param {SearchBooksClient} client
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