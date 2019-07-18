const StreamEndpointWidget = require('../../../../../../../src/libraries/service-application/widgets/StreamEndpointWidget');
const SearchResultsView = require('../client-adapter/SearchResultsView');
const SearchCompleteView = require('../client-adapter/SearchCompleteView');
const Container = require('container').Container;
const MessageBus = require('message-bus').MessageBus;
const SearchResultsController = require('../client-adapter/SearchResultsController');

/**
 * @implements {SearchResultsView}
 * @implements {SearchCompleteView}
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
        if (request.getMeta().format !== 'txt') {
            throw 'Invalid format';
        }
        const controller = this._container.make(SearchResultsController, { [SearchResultsView]: this, [SearchCompleteView]: this });

        controller.retrieveSearchResults(request.getParams().id);
    }

    /**
     * @override
     */
    renderResults(viewModel) {
        this.write(viewModel.response);
    }

    /**
     * @override
     */
    renderComplete() {
        super.close();
    }
};