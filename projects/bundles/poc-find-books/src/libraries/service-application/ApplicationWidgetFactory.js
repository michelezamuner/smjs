const _package = 'FindBooks.ServiceApplication.';

const InputParser = require('./input-parser/InputParser');
const WidgetAdapterFactory = require('./widgets/WidgetAdapterFactory');
const Config = require('./Config');
const MessageBus = require('message-bus').MessageBus;
const ApplicationWidgetDeps = require('./widgets/ApplicationWidgetDeps');
const Connection = require('./server/Connection');

module.exports = class ApplicationWidgetFactory {
    static get __DEPS__() { return [ InputParser, WidgetAdapterFactory, Config ]; }
    static toString() { return _package + ApplicationWidgetFactory.name; }

    /**
     * @param {InputParser} parser
     * @param {WidgetAdapterFactory} adapterFactory
     * @param {Config} config
     */
    constructor(parser, adapterFactory, config) {
        this._parser = parser;
        this._adapterFactory = adapterFactory;
        this._applicationWidgetClass = config.getApplicationWidgetClass();
    }

    /**
     * @param {Connection} connection
     * @return {Application}
     */
    create(connection) {
        const deps = new ApplicationWidgetDeps(new MessageBus(), connection, this._parser, this._adapterFactory);

        return new this._applicationWidgetClass(deps);
    }
};
