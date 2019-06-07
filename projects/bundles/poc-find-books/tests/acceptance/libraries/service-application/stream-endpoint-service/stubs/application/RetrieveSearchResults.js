const SearchResultsPresenter = require('./SearchResultsPresenter');
const SearchCompletePresenter = require('./SearchCompletePresenter');

module.exports = class RetrieveSearchResults {
    static get __DEPS__() { return [ SearchResultsPresenter, SearchCompletePresenter ]; }
    /**
     * @param {SearchResultsPresenter} resultsPresenter
     * @param {SearchCompletePresenter} completePresenter
     */
    constructor(resultsPresenter, completePresenter) {
        this._resultsPresenter = resultsPresenter;
        this._completePresenter = completePresenter;
    }

    /**
     * @param {string} searchId 
     */
    retrieve(searchId) {
        switch (searchId) {
            case 1234:
                this._resultsPresenter.present(process.env.SM_RESPONSE11);
                this._resultsPresenter.present(process.env.SM_RESPONSE12);
                break;
            case 4321:
                this._resultsPresenter.present(process.env.SM_RESPONSE21);
                this._resultsPresenter.present(process.env.SM_RESPONSE22);
                break;
        }
        this._completePresenter.present();
    }
};