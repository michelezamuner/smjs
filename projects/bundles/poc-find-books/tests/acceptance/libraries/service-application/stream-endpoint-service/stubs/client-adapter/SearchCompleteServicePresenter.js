const SearchCompletePresenter = require('../application/SearchCompletePresenter');
const SearchCompleteView = require('./SearchCompleteView');

module.exports = class SearchCompleteServicePresenter extends SearchCompletePresenter {
    static get __DEPS__() { return [ SearchCompleteView ]; }

    /**
     * @param {SearchCompleteView} view 
     */
    constructor(view) {
        super();
        this._view = view;
    }

    /**
     * @override
     */
    present() {
        this._view.render();
    }
};