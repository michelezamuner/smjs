const SearchResultsPresenter = require('../application/SearchResultsPresenter');
const SearchResultsView = require('./SearchResultsView');

module.exports = class SearchResultsServicePresenter extends SearchResultsPresenter {
    static get __DEPS__() { return [ SearchResultsView ]; }

    /**
     * @param {SearchResultsView} view 
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