const _package = 'FindBooks.ServiceApplication.Application.';

const MessageBus = require('message-bus').MessageBus;
const InputParser = require('../input-parser/InputParser');
const Connection = require('../server/Connection');
const SendResponse = require('../messages/SendResponse');
const SendData = require('../messages/SendData');
const RequestReceived = require('../messages/RequestReceived');

module.exports = class Application {
    static toString() { return _package + Application.name; }

    /**
     * @param {MessageBus} bus
     * @param {InputParser} parser
     * @param {Object} widgets
     */
    constructor(bus, parser, widgets) {
        this._bus = bus;
        this._parser = parser;
        this._widgets = {};
        this._widgets = widgets;
    }

    /**
     * @param {Connection} connection
     */
    connect(connection) {
        this._bus.register([SendResponse], msg => this._sendResponse(connection, msg));
        this._bus.register([SendData], msg => this._sendData(connection, msg));

        connection.on('data', data => this._onData(data));
    }

    /**
     * @param {string} name
     * @return {Object}
     */
    getWidget(name) {
        return this._widgets[name];
    }

    /**
     * @param {Connection} connection
     * @param {SendResponse} msg
     * @private
     */
    _sendResponse(connection, msg) {
        connection.end(msg.getResponse());
    }

    /**
     * @param {Connection} connection
     * @param {SendData} msg
     * @private
     */
    _sendData(connection, msg) {
        connection.write(msg.getData());
    }

    /**
     * @param {string} data
     * @private
     */
    _onData(data) {
        this._bus.send(new RequestReceived(this._parser.parse(data)));
    }
};
