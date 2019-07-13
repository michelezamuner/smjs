const Container = require('container').Container;
const InputParser = require('../../../../../../src/libraries/service-application/input-parser/InputParser');
const BasicInputParser = require('../../../../../../src/libraries/service-application/input-parser/BasicInputParser');
const ApplicationWidgetFactory = require('../../../../../../src/libraries/service-application/ApplicationWidgetFactory');
const ServiceApplicationWidget = require('./widgets-ui/ServiceApplicationWidget');
const MessageBus = require('message-bus').MessageBus;
const Connection = require('../../../../../../src/libraries/service-application/server/Connection');
const SearchBooksPresenter = require('./application/SearchBooksPresenter');
const SearchBooksServicePresenter = require('./client-adapter/SearchBooksServicePresenter');
const SearchBooksView = require('./client-adapter/SearchBooksView');
const SearchBooksJsonView = require('./client-adapter/SearchBooksJsonView');

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
        
        c.bind(SearchBooksPresenter, SearchBooksServicePresenter);
        c.bind(SearchBooksView, (container, context) => {
            if (context.format !== 'json') {
                throw 'Invalid format';
            }

            return container.make(SearchBooksJsonView, context);
        }, SearchBooksServicePresenter);
    }
};
