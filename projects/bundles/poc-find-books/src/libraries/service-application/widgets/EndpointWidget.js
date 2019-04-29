const _package = 'FindBooks.ServiceApplication.Widgets.';

const MessageBus = require('message-bus').MessageBus;
const RequestReceived = require('../messages/RequestReceived');
const SendResponse = require('../messages/SendResponse');

module.exports = class EndpointWidget {
    static toString() { return _package + EndpointWidget.name; }

    /**
     * @param {MessageBus} bus
     * @param {string} endpoint
     */
    constructor(bus, endpoint) {
        this._bus = bus;
        this._endpoint = endpoint;
        this._bus.register([RequestReceived], event => this._onRequest(event));
    }

    /**
     * @param {Object} params
     */
    receive(params) {
        throw 'Not implemented';
    }

    /**
     * @param {string} response
     */
    respond(response) {
        this._bus.send(new SendResponse(response));
    }

    /**
     * @param {RequestReceived} event
     */
    _onRequest(event) {
        if (event.getRequest().getEndpoint() !== this._endpoint) {
            return;
        }
        this.receive(event.getRequest().getParams());
    }
};
