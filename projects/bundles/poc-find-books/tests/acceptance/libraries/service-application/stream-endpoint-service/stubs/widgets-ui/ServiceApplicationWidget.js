const ApplicationWidget = require('../../../../../../../src/libraries/service-application/widgets/ApplicationWidget');
const ApplicationWidgetDeps = require('../../../../../../../src/libraries/service-application/widgets/ApplicationWidgetDeps');
const SearchResultsWidget = require('./SearchResultsWidget');

module.exports = class ServiceApplicationWidget extends ApplicationWidget {
    /**
     * @param {ApplicationWidgetDeps} deps
     */
    constructor(deps) {
        super(deps);
        this.addWidget('search-results', SearchResultsWidget, { endpoint: process.env.SM_ENDPOINT });
    }
};