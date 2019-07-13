const StreamEndpointWidget = require('../../../../../../../src/libraries/service-application/widgets/StreamEndpointWidget');
const SearchResultsClient = require('../client-adapter/SearchResultsClient');
const Container = require('container').Container;
const MessageBus = require('message-bus').MessageBus;
const SearchResultsController = require('../client-adapter/SearchResultsController');

/**
 * @implements {SearchResultsClient}
 */
module.exports = class SearchResultsWidget extends StreamEndpointWidget {
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
        const searchId = request.getParams().id;
        const format = request.getMeta().format;
        const controller = this._container.make(SearchResultsController, { format: format, [SearchResultsClient]: this });

        controller.retrieveSearchResults(searchId);
    }

    /**
     * @override
     */
    send(response) {
        this.write(response);
    }

    /**
     * @override
     */
    close() {
        super.close();
    }
};