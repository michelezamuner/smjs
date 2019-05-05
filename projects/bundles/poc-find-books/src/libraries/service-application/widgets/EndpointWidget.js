const _package = 'FindBooks.ServiceApplication.Widgets.';

const Widget = require('./Widget');
const WidgetDeps = require('./WidgetDeps');
const RequestReceived = require('../messages/RequestReceived');
const SendResponse = require('../messages/SendResponse');

/**
 * @abstract
 */
module.exports = class EndpointWidget extends Widget {
    static toString() { return _package + EndpointWidget.name; }

    /**
     * @param {WidgetDeps} deps
     */
    constructor(deps) {
        super(deps);
        this._endpoint = deps.getParams().endpoint;
    }

    /**
     * @override
     */
    connect() {
        super.connect();
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
