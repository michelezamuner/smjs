const ResponseEndpointWidget = require('../../../../../../../src/libraries/service-application/widgets/ResponseEndpointWidget');
const SearchBooksClient = require('../client-adapter/SearchBooksClient');
const Container = require('container').Container;
const MessageBus = require('message-bus').MessageBus;
const SearchBooksController = require('../client-adapter/SearchBooksController');

/**
 * @implements {SearchBooksClient}
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
        const searchText = request.getParams().searchText;
        const format = request.getMeta().format;
        const controller = this._container.make(SearchBooksController, { format: format, [SearchBooksClient]: this });

        controller.search(searchText);
    }

    /**
     * @override
     */
    send(response) {
        this.respond(response);
    }
};