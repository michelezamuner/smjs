const SearchBooksPresenter = require('./SearchBooksPresenter');

module.exports = class SearchBooks {
    static get __DEPS__() { return [ SearchBooksPresenter ]; }

    /**
     * @param {SearchBooksPresenter} presenter
     */
    constructor(presenter) {
        this._presenter = presenter;
    }

    /**
     * @param {string} searchText
     */
    search(searchText) {
        if (searchText === 'text') {
            this._presenter.present(process.env.SM_RESPONSE);
        }
    }
};