const SearchBooks = require('../../../../../../../src/application-services/api-gateway/application/api_gateway/search_books/SearchBooks');
const SearchBooksPresenter = require('../../../../../../../src/application-services/api-gateway/application/api_gateway/search_books/Presenter');
const SearchBooksClient = require('../../../../../../../src/application-services/api-gateway/application/clients/SearchBooksClient');
const Response = require('../../../../../../../src/application-services/api-gateway/application/api_gateway/search_books/Response');

/**
 * @type {Object|SearchBooksPresenter}
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
    expect(SearchBooks.__DEPS__).toStrictEqual([ SearchBooksPresenter, SearchBooksClient ]);
});

test('sends request to client', () => {
    const request = { getSearchBooksRequest: () => searchBooksRequest };

    service.route(request);

    expect(presenter.present.mock.calls[0][0]).toStrictEqual(new Response(searchBooksResponse));
});
