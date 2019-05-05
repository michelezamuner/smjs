const _package = 'FindBooks.ServiceApplication.Application.';

const MessageBus = require('message-bus').MessageBus;
const Connection = require('../server/Connection');
const InputParser = require('../input-parser/InputParser');

module.exports = class ApplicationWidgetDeps {
    static toString() { return _package + ApplicationWidgetDeps.name; }

    /**
     * @param {MessageBus} bus
     * @param {Connection} connection
     * @param {InputParser} parser
     */
    constructor(bus, connection, parser) {
        this._bus = bus;
        this._connection = connection;
        this._parser = parser;
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
};
