const _package = 'FindBooks.ApiGateway.ApiGateway.SearchBooks.';

const Presenter = require('./Presenter');
const SearchBooksClient = require('../../clients/SearchBooksClient');
const Request = require('./Request');
const Response = require('./Response');

module.exports = class SearchBooks {
    static get __DEPS__() { return [ Presenter, SearchBooksClient ]; }
    static toString() { return _package + SearchBooks.name; }

    /**
     * @param {Presenter} presenter
     * @param {SearchBooksClient} client
     */
    constructor(presenter, client) {
        this._presenter = presenter;
        this._client = client;
    }

    /**
     * @param {Request} request
     */
    route(request) {
        const searchBooksResponse = this._client.send(request.getSearchBooksRequest());
        this._presenter.present(new Response(searchBooksResponse));
    }
};
