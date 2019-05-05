const _package = 'FindBooks.ServiceApplication.Application.';

const MessageBus = require('message-bus').MessageBus;
const UI = require('./UI');
const ApplicationWidgetDeps = require('./ApplicationWidgetDeps');
const SendResponse = require('../messages/SendResponse');
const SendData = require('../messages/SendData');
const RequestReceived = require('../messages/RequestReceived');

module.exports = class Application {
    static toString() { return _package + Application.name; }

    /**
     * @param {MessageBus} bus
     * @param {UI} ui
     * @param {ApplicationWidgetDeps} deps
     */
    constructor(bus, ui, deps) {
        this._bus = bus;
        this._ui = ui;
        this._connection = deps.getConnection();
        this._parser = deps.getParser();
    }

    connect() {
        this._bus.register([SendResponse], msg => this._sendResponse(msg));
        this._bus.register([SendData], msg => this._sendData(msg));

        this._connection.on('data', data => this._onData(data));

        for (const widget of this._ui.getWidgets()) {
            widget.connect();
        }
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
