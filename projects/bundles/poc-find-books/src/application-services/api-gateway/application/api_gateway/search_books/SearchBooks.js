const Presenter = require('./Presenter');
const SearchBooksClient = require('../../clients/SearchBooksClient');
const Request = require('./Request');
const Response = require('./Response');

module.exports = class ApiGateway_Application_ApiGateway_SearchBooks_SearchBooks {
    static get __DEPS__() { return [ Presenter, SearchBooksClient ]; }

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
