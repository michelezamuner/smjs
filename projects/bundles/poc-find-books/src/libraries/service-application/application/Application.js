const _package = 'FindBooks.ServiceApplication.Application.';

const Widget = require('../widgets/Widget');
const WidgetDeps = require('../widgets/WidgetDeps');
const ApplicationWidgetDeps = require('./ApplicationWidgetDeps');
const SendResponse = require('../messages/SendResponse');
const SendData = require('../messages/SendData');
const RequestReceived = require('../messages/RequestReceived');

module.exports = class Application extends Widget {
    static toString() { return _package + Application.name; }

    /**
     * @param {ApplicationWidgetDeps} deps
     */
    constructor(deps) {
        super(deps.getBus());
        this._connection = deps.getConnection();
        this._parser = deps.getParser();
    }

    /**
     * @override
     */
    addWidget(name, type, params = {}) {
        const deps = new WidgetDeps(this._bus, this, params);
        this._widgets.set(name, new type(deps));
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
