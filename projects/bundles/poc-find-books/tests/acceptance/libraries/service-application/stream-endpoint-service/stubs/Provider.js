const Container = require('container').Container;
const InputParser = require('../../../../../../src/libraries/service-application/input-parser/InputParser');
const BasicInputParser = require('../../../../../../src/libraries/service-application/input-parser/BasicInputParser');
const WidgetAdapterFactory = require('../../../../../../src/libraries/service-application/widgets/WidgetAdapterFactory');
const Config = require('../../../../../../src/libraries/service-application/Config');
const ServiceApplicationWidget = require('./widgets-ui/ServiceApplicationWidget');
const SearchResultsPresenter = require('./application/SearchResultsPresenter');
const SearchResultsServicePresenter = require('./client-adapter/SearchResultsServicePresenter');
const SearchCompletePresenter = require('./application/SearchCompletePresenter');
const SearchCompleteServicePresenter = require('./client-adapter/SearchCompleteServicePresenter');
const SearchResultsView = require('./client-adapter/SearchResultsView');
const SearchResultsTextView = require('./client-adapter/SearchResultsTextView');
const SearchCompleteView = require('./client-adapter/SearchCompleteView');
const SearchCompleteEmptyView = require('./client-adapter/SearchCompleteEmptyView');

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
        c.bind(WidgetAdapterFactory, { createAdapter(adapterClass, widget) { return new adapterClass(c, widget); }});
        c.bind(Config, { getApplicationWidgetClass() { return ServiceApplicationWidget; }});
        c.bind(SearchResultsPresenter, SearchResultsServicePresenter);
        c.bind(SearchCompletePresenter, SearchCompleteServicePresenter);
        c.bind(SearchResultsView, (container, context) => {
            if (context.format !== 'txt') {
                throw 'Invalid format';
            }
            return container.make(SearchResultsTextView, context);
        }, SearchResultsServicePresenter);
        c.bind(SearchCompleteView, SearchCompleteEmptyView, SearchCompleteServicePresenter);
    }
};