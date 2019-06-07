const SearchBooks = require('../application/SearchBooks');

module.exports = class SearchBooksController {
    static get __DEPS__() { return [ SearchBooks ]; }

    /**
     * @param {SearchBooks} service 
     */
    constructor(service) {
        this._service = service;
    }

    /**
     * @param {string} searchText 
     */
    search(searchText) {
        this._service.search(searchText);
    }
};