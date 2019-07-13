const _package = 'FindBooks.ServiceApplication.Widgets.';

const Widget = require('./Widget');
const MessageBus = require('message-bus').MessageBus;
const RequestReceived = require('../messages/RequestReceived');
const ServiceRequest = require('../input-parser/ServiceRequest');

/**
 * @abstract
 */
module.exports = class EndpointWidget extends Widget {
    static toString() { return _package + EndpointWidget.name; }

    /**
     * @param {MessageBus} bus
     * @param {Object} params
     */
    constructor(bus, params) {
        super();
        this._bus = bus;
        this._endpoint = params.endpoint;
    }

    /**
     * @override
     */
    connect() {
        super.connect();
        this._bus.register([RequestReceived], msg => this._onRequest(msg));
    }

    /**
     * @param {ServiceRequest} request
     */
    receive(request) {
        throw 'Not implemented';
    }

    /**
     * @param {RequestReceived} msg
     */
    _onRequest(msg) {
        const request = msg.getRequest();
        if (request.getEndpoint() !== this._endpoint) {
            return;
        }
        this.receive(request);
    }
};