const _package = 'FindBooks.ServiceApplication.Widgets.';

const MessageBus = require('message-bus').MessageBus;
const Connection = require('../server/Connection');
const InputParser = require('../input-parser/InputParser');
const WidgetAdapterFactory = require('./WidgetAdapterFactory');

module.exports = class ApplicationWidgetDeps {
    static toString() { return _package + ApplicationWidgetDeps.name; }

    /**
     * @param {MessageBus} bus
     * @param {Connection} connection
     * @param {InputParser} parser
     * @param {WidgetAdapterFactory} adapterFactory
     */
    constructor(bus, connection, parser, adapterFactory) {
        this._bus = bus;
        this._connection = connection;
        this._parser = parser;
        this._adapterFactory = adapterFactory;
    }

    /**
     * @return {MessageBus}
     */
    getBus() {
        return this._bus;
    }

    /**
     * @return {Connection}
     */
    getConnection() {
        return this._connection;
    }

    /**
     * @return {InputParser}
     */
    getParser() {
        return this._parser;
    }

    /**
     * @return {WidgetAdapterFactory}
     */
    getAdapterFactory() {
        return this._adapterFactory;
    }
};
