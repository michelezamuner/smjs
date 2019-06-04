const _package = 'FindBooks.ServiceApplication.Widgets.';

const StandardWidget = require('./StandardWidget');
const WidgetDeps = require('./WidgetDeps');
const RequestReceived = require('../messages/RequestReceived');
const ServiceRequest = require('../input-parser/ServiceRequest');

/**
 * @abstract
 */
module.exports = class EndpointWidget extends StandardWidget {
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
     * @param {ServiceRequest} request
     */
    receive(request) {
        throw 'Not implemented';
    }

    /**
     * @param {RequestReceived} event
     */
    _onRequest(event) {
        const request = event.getRequest();
        if (request.getEndpoint() !== this._endpoint) {
            return;
        }
        this.receive(request);
    }
};
