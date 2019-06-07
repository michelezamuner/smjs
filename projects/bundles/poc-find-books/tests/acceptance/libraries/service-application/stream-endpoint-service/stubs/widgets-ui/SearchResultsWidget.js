const StreamEndpointWidget = require('../../../../../../../src/libraries/service-application/widgets/StreamEndpointWidget');
const SearchResultsWidgetAdapter = require('./SearchResultsWidgetAdapter');

module.exports = class SearchResultsWidget extends StreamEndpointWidget {
    /** @override **/
    getAdapterClass() { return SearchResultsWidgetAdapter; }

    /**
     * @param {ServiceRequest} request
     */
    receive(request) {
        const searchId = request.getParams().id;
        const format = request.getMeta().format;
        this.getAdapter().receive(searchId, format);
    }
};