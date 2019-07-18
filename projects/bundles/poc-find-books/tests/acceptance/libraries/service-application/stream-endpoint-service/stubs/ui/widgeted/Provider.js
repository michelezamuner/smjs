const Container = require('container').Container;
const InputParser = require('../../../../../../../../src/libraries/service-application/input-parser/InputParser');
const BasicInputParser = require('../../../../../../../../src/libraries/service-application/input-parser/BasicInputParser');
const ApplicationWidgetFactory = require('../../../../../../../../src/libraries/service-application/ApplicationWidgetFactory');
const ServiceApplicationWidget = require('./ServiceApplicationWidget');
const MessageBus = require('message-bus').MessageBus;
const Connection = require('../../../../../../../../src/libraries/service-application/server/Connection');
const SearchResultsPresenter = require('../../application/SearchResultsPresenter');
const SearchResultsServicePresenter = require('../../client/SearchResultsServicePresenter');
const SearchCompletePresenter = require('../../application/SearchCompletePresenter');
const SearchCompleteServicePresenter = require('../../client/SearchCompleteServicePresenter');

module.exports = class Provider {
    static get __DEPS__() { return [ Container ]; }

    /**
     * @param {Container} container 
     */
    constructor(container) {
        this._container = container;
    }

    register() {
        const c = this._container;
        c.bind(InputParser, BasicInputParser);
        c.bind(ApplicationWidgetFactory, { create(bus, connection) {
            return c.make(ServiceApplicationWidget, { [MessageBus]: bus, [Connection]: connection });
        }});
        
        c.bind(SearchResultsPresenter, SearchResultsServicePresenter);
        c.bind(SearchCompletePresenter, SearchCompleteServicePresenter);
    }
};