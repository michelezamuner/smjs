const _package = 'FindBooks.ServiceApplication.Application.';

const MessageBus = require('message-bus').MessageBus;
const UI = require('./UI');
const InputParser = require('../input-parser/InputParser');
const Connection = require('../server/Connection');
const SendResponse = require('../messages/SendResponse');
const SendData = require('../messages/SendData');
const RequestReceived = require('../messages/RequestReceived');

module.exports = class Application {
    static toString() { return _package + Application.name; }

    /**
     * @param {MessageBus} bus
     * @param {UI} ui
     * @param {InputParser} parser
     */
    constructor(bus, ui, parser) {
        this._bus = bus;
        this._ui = ui;
        this._parser = parser;
    }

    /**
     * @param {Connection} connection
     */
    connect(connection) {
        this._bus.register([SendResponse], msg => this._sendResponse(connection, msg));
        this._bus.register([SendData], msg => this._sendData(connection, msg));

        connection.on('data', data => this._onData(data));

        for (const widget of this._ui.getWidgets()) {
            widget.connect();
        }
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
