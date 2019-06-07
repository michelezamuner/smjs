const ResponseEndpointWidget = require('../../../../../../../src/libraries/service-application/widgets/ResponseEndpointWidget');
const SearchBooksWidgetAdapter = require('./SearchBooksWidgetAdapter');
const ServiceRequest = require('../../../../../../../src/libraries/service-application/input-parser/ServiceRequest');

module.exports = class SearchBooksWidget extends ResponseEndpointWidget {
    /** @override */
    getAdapterClass() { return SearchBooksWidgetAdapter; }

    /**
     * @param {ServiceRequest} request
     */
    receive(request) {
        const searchText = request.getParams().searchText;
        const format = request.getMeta().format;
        this.getAdapter().receive(searchText, format);
    }
};