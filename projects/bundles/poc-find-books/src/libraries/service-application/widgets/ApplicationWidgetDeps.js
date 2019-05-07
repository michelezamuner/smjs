const _package = 'FindBooks.ServiceApplication.Widgets.';

const MessageBus = require('message-bus').MessageBus;
const Connection = require('../server/Connection');
const InputParser = require('../input-parser/InputParser');
const WidgetAdapters = require('./WidgetAdapters');

module.exports = class ApplicationWidgetDeps {
    static toString() { return _package + ApplicationWidgetDeps.name; }

    /**
     * @param {MessageBus} bus
     * @param {Connection} connection
     * @param {InputParser} parser
     * @param {WidgetAdapters} adapters
     */
    constructor(bus, connection, parser, adapters) {
        this._bus = bus;
        this._connection = connection;
        this._parser = parser;
        this._adapters = adapters;
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
     * @return {WidgetAdapters}
     */
    getAdapters() {
        return this._adapters;
    }
};
