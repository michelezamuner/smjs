const ResponseEndpointWidget = require('../../../../../../../../src/libraries/service-application/widgets/ResponseEndpointWidget');
const SearchBooksView = require('../../client/SearchBooksView');
const Container = require('container').Container;
const MessageBus = require('message-bus').MessageBus;
const SearchBooksController = require('../../client/SearchBooksController');

/**
 * @implements {SearchBooksView}
 */
module.exports = class SearchBooksWidget extends ResponseEndpointWidget {
    /**
     * @param {Container} container
     * @param {MessageBus} bus
     * @param {Object} params
     */
    constructor(container, bus, params) {
        super(bus, params);
        this._container = container;
    }

    /**
     * @override
     */
    receive(request) {
        if (request.getMeta().format !== 'json') {
            throw 'Invalid format';
        }
        const controller = this._container.make(SearchBooksController, { [SearchBooksView]: this });

        controller.search(request.getParams().searchText);
    }

    /**
     * @override
     */
    renderResponse(viewModel) {
        this.respond(viewModel.response);
    }
};