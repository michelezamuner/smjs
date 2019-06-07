const SearchBooksView = require('./SearchBooksView');
const SearchBooksAdapter = require('./SearchBooksAdapter');

module.exports = class SearchBooksJsonView extends SearchBooksView {
    static get __DEPS__() { return [ SearchBooksAdapter ]; }

    /**
     * @param {SearchBooksAdapter} adapter 
     */
    constructor(adapter) {
        super();
        this._adapter = adapter;
    }

    /**
     * @override
     */
    render(viewModel) {
        this._adapter.respond(viewModel.response);
    }
};