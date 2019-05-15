const SearchBooks = require('../../../../../../../src/application/api-gateway/application/api_gateway/search_books/SearchBooks');
const Presenter = require('../../../../../../../src/application/api-gateway/application/api_gateway/search_books/Presenter');
const SearchBooksClient = require('../../../../../../../src/application/api-gateway/application/clients/SearchBooksClient');
const Response = require('../../../../../../../src/application/api-gateway/application/api_gateway/search_books/Response');
const Request = require('../../../../../../../src/application/api-gateway/application/api_gateway/search_books/Request');
const SearchBooksRequest = require('../../../../../../../src/domain/api/SearchBooksRequest');
const SearchBooksResponse = require('../../../../../../../src/domain/api/SearchBooksResponse');

/**
 * @type {Object|Presenter}
 */
const presenter = {};

/**
 * @type {Object|SearchBooksClient}
 */
const client = {};

/**
 * @type {null|SearchBooks}
 */
let service = null;

/**
 * @type {Object}
 */
const searchBooksRequest = {};

/**
 * @type {Object}
 */
const searchBooksResponse = {};

beforeEach(() => {
    presenter.present = jest.fn();
    client.send = request => request === searchBooksRequest ? searchBooksResponse : null;
    service = new SearchBooks(presenter, client);
});

test('can be injected', () => {
    expect(SearchBooks.__DEPS__).toStrictEqual([ Presenter, SearchBooksClient ]);
});

test('provides fqcn', () => {
    expect(SearchBooks.toString()).toBe('FindBooks.ApiGateway.ApiGateway.SearchBooks.SearchBooks');
    expect(Presenter.toString()).toBe('FindBooks.ApiGateway.ApiGateway.SearchBooks.Presenter');
    expect(Request.toString()).toBe('FindBooks.ApiGateway.ApiGateway.SearchBooks.Request');
    expect(Response.toString()).toBe('FindBooks.ApiGateway.ApiGateway.SearchBooks.Response');
    expect(SearchBooksClient.toString()).toBe('FindBooks.ApiGateway.Clients.SearchBooksClient');
    expect(SearchBooksRequest.toString()).toBe('FindBooks.Api.SearchBooksRequest');
    expect(SearchBooksResponse.toString()).toBe('FindBooks.Api.SearchBooksResponse');
});

test('sends request to client', () => {
    const request = { getSearchBooksRequest: () => searchBooksRequest };

    service.route(request);

    expect(presenter.present.mock.calls[0][0]).toStrictEqual(new Response(searchBooksResponse));
});
