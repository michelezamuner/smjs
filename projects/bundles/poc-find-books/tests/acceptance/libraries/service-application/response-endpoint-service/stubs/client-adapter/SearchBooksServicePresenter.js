const SearchBooksPresenter = require('../application/SearchBooksPresenter');
const SearchBooksView = require('./SearchBooksView');

module.exports = class SearchBooksServicePresenter extends SearchBooksPresenter {
    static get __DEPS__() { return [ SearchBooksView ]; }

    /**
     * @param {SearchBooksView} view
     */
    constructor(view) {
        super();
        this._view = view;
    }

    /**
     * @override
     */
    present(response) {
        const viewModel = { response: response };
        this._view.render(viewModel);
    }
};