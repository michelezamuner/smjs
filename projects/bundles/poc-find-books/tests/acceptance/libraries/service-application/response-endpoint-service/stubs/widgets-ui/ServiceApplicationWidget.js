const ApplicationWidget = require('../../../../../../../src/libraries/service-application/widgets/ApplicationWidget');
const ApplicationWidgetDeps = require('../../../../../../../src/libraries/service-application/widgets/ApplicationWidgetDeps');
const SearchBooksWidget = require('./SearchBooksWidget');

module.exports = class ServiceApplicationWidget extends ApplicationWidget {
    /**
     * @param {ApplicationWidgetDeps} deps
     */
    constructor(deps) {
        super(deps);
        this.addWidget('search-books', SearchBooksWidget, { endpoint: process.env.SM_ENDPOINT });
    }
};