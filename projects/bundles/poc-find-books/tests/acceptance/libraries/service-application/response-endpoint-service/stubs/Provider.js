const Container = require('container').Container;
const InputParser = require('../../../../../../src/libraries/service-application/input-parser/InputParser');
const BasicInputParser = require('../../../../../../src/libraries/service-application/input-parser/BasicInputParser');
const WidgetAdapterFactory = require('../../../../../../src/libraries/service-application/widgets/WidgetAdapterFactory');
const Config = require('../../../../../../src/libraries/service-application/Config');
const ServiceApplicationWidget = require('./widgets-ui/ServiceApplicationWidget');
const SearchBooksPresenter = require('./application/SearchBooksPresenter');
const SearchBooksServicePresenter = require('./client-adapter/SearchBooksServicePresenter');
const SearchBooksView = require('./client-adapter/SearchBooksView');
const SearchBooksJsonView = require('./client-adapter/SearchBooksJsonView');
const SearchBooksAdapter = require('./client-adapter/SearchBooksAdapter');
const SearchBooksWidgetAdapter = require('./widgets-ui/SearchBooksWidgetAdapter');

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
        c.bind(SearchBooksPresenter, SearchBooksServicePresenter);
        c.bind(SearchBooksView, (container, context) => {
            if (context.format !== 'json') {
                throw 'Invalid format';
            }
            return container.make(SearchBooksJsonView, context.adapter);
        });
        c.bind(SearchBooksAdapter, (container, adapter) => {
            if (adapter.constructor !== SearchBooksWidgetAdapter) {
                throw 'Invalid adapter';
            }
            return adapter;
        });
    }
};
