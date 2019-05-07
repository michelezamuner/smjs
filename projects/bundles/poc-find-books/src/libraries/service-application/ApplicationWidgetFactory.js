const _package = 'FindBooks.ServiceApplication.';

const InputParser = require('./input-parser/InputParser');
const MessageBus = require('message-bus').MessageBus;
const ApplicationWidgetDeps = require('./widgets/ApplicationWidgetDeps');
const Connection = require('./server/Connection');
const WidgetAdapters = require('./widgets/WidgetAdapters');

module.exports = class ApplicationWidgetFactory {
    static get __DEPS__() { return [ InputParser, WidgetAdapters ]; }
    static toString() { return _package + ApplicationWidgetFactory.name; }

    /**
     * @param {InputParser} parser
     * @param {WidgetAdapters} adapters
     */
    constructor(parser, adapters) {
        this._parser = parser;
        this._adapters = adapters;
    }

    /**
     * @param {Function} applicationWidgetClass
     * @param {Connection} connection
     * @return {Application}
     */
    create(applicationWidgetClass, connection) {
        const deps = new ApplicationWidgetDeps(new MessageBus(), connection, this._parser, this._adapters);

        return new applicationWidgetClass(deps);
    }
};
