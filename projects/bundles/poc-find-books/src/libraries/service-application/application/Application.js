const _package = 'FindBooks.ServiceApplication.Application.';

const MessageBus = require('message-bus').MessageBus;
const WidgetFactory = require('./WidgetFactory');
const InputParser = require('../input-parser/InputParser');
const Connection = require('../server/Connection');
const SendResponse = require('../messages/SendResponse');
const SendData = require('../messages/SendData');
const RequestReceived = require('../messages/RequestReceived');

module.exports = class Application {
    static get __DEPS__() { return [ MessageBus, WidgetFactory, InputParser ] };
    static toString() { return _package + Application.name; }

    /**
     * @param {MessageBus} bus
     * @param {WidgetFactory} widgetFactory
     * @param {InputParser} parser
     */
    constructor(bus, widgetFactory, parser) {
        this._bus = bus;
        this._widgetFactory = widgetFactory;
        this._parser = parser;
        this._widgets = {};
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
     * @param {Function} type
     * @param {Array} args
     */
    addWidget(name, type, args) {
        this._widgets[name] = this._widgetFactory.create(type, this._bus, args);
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
