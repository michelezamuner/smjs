const _package = 'FindBooks.ServiceApplication.Widgets.';

const StandardWidget = require('./StandardWidget');
const WidgetDeps = require('./WidgetDeps');
const RequestReceived = require('../messages/RequestReceived');

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
     * @param {Object} params
     */
    receive(params) {
        throw 'Not implemented';
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
