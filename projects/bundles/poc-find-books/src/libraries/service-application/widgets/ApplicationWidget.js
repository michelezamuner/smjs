const _package = 'FindBooks.ServiceApplication.Widgets.';

const Widget = require('./Widget');
const MessageBus = require('message-bus').MessageBus;
const Connection = require('../server/Connection');
const InputParser = require('../input-parser/InputParser');
const SendResponse = require('../messages/SendResponse');
const SendData = require('../messages/SendData');
const RequestReceived = require('../messages/RequestReceived');

module.exports = class ApplicationWidget extends Widget {
    static toString() { return _package + ApplicationWidget.name; }

    /**
     * @param {MessageBus} bus
     * @param {Connection} connection
     * @param {InputParser} parser
     */
    constructor(bus, connection, parser) {
        super();
        this._bus = bus;
        this._connection = connection;
        this._parser = parser;
    }

    /**
     * @override
     */
    connect() {
        super.connect();
        this._bus.register([SendResponse], msg => this._sendResponse(msg));
        this._bus.register([SendData], msg => this._sendData(msg));

        this._connection.on('data', data => this._onData(data));
    }

    /**
     * @param {SendResponse} msg
     * @private
     */
    _sendResponse(msg) {
        this._connection.end(msg.getResponse());
    }

    /**
     * @param {SendData} msg
     * @private
     */
    _sendData(msg) {
        this._connection.write(msg.getData());
    }

    /**
     * @param {string} data
     * @private
     */
    _onData(data) {
        this._bus.send(new RequestReceived(this._parser.parse(data)));
    }
};