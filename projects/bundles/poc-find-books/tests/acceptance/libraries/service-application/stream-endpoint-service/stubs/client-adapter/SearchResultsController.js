const RetrieveSearchResults = require('../application/RetrieveSearchResults');

module.exports = class SearchResultsController {
    static get __DEPS__() { return [ RetrieveSearchResults ]; }

    /**
     * @param {RetrieveSearchResults} service 
     */
    constructor(service) {
        this._service = service;
    }

    /**
     * @param {string} searchId 
     */
    retrieveSearchResults(searchId) {
        this._service.retrieve(searchId);
    }
};