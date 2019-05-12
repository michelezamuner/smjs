const EndpointWidget = require('../../../../../src/libraries/service-application/widgets/EndpointWidget');
const StandardWidget = require('../../../../../src/libraries/service-application/widgets/StandardWidget');
const MessageBus = require('message-bus').MessageBus;
const ApplicationWidget = require('../../../../../src/libraries/service-application/widgets/ApplicationWidget');
const RequestReceived = require('../../../../../src/libraries/service-application/messages/RequestReceived');
const ServiceRequest = require('../../../../../src/libraries/service-application/input-parser/ServiceRequest');
const WidgetDeps = require('../../../../../src/libraries/service-application/widgets/WidgetDeps');

/**
 * @type {Object|MessageBus}
 */
const bus = {};

/**
 * @type {Object|ApplicationWidget}
 */
const app = {};

/**
 * @type {string}
 */
const endpoint = 'endpoint';

/**
 * @type {WidgetDeps}
 */
const deps = new WidgetDeps(bus, app, { endpoint: endpoint });

/**
 * @type {null|EndpointWidget}
 */
let widget = null;

/**
 * @type {Object}
 */
const params = {};

/**
 * @type {ServiceRequest}
 */
const request = new ServiceRequest(endpoint, params);

beforeEach(() => {
    bus.register = (types, callback) => {
        if (types[0] !== RequestReceived) return;
        bus.callback = callback;
    };
    bus.send = jest.fn(event => event instanceof RequestReceived ? bus.callback(event) : null);

    widget = new EndpointWidget(deps);
});

test('extends standard widget', () => {
    expect(widget).toBeInstanceOf(StandardWidget);
});

test('provides fqcn', () => {
    expect(EndpointWidget.toString()).toBe('FindBooks.ServiceApplication.Widgets.EndpointWidget');
});

test('must implement receive method', () => {
    expect(() => widget.receive({})).toThrow('Not implemented');
});

test('calls parent connect', () => {
    class StubWidget extends StandardWidget {
        /**
         * @param {WidgetDeps} deps
         */
        constructor(deps) {
            super(deps);
            this._isConnected = false;
        }

        /**
         * @override
         */
        connect() {
            this._isConnected = true;
        }

        /**
         * @return {boolean}
         */
        isConnected() {
            return this._isConnected;
        }
    }

    widget.addWidget('name', StubWidget);
    widget.connect();

    expect(widget.getWidget('name').isConnected()).toBe(true);
});

test('calls receive method on input', () => {
    class StubWidget extends EndpointWidget {
        receive(arg) {
            expect(arg).toStrictEqual(params);
        }
    }

    const widget = new StubWidget(deps);
    widget.connect();

    bus.send(new RequestReceived(request));

    expect.assertions(1);
});

test('ignores events with different endpoints', () => {
    class StubWidget extends EndpointWidget {
        receive(arg) {
            expect(arg).toStrictEqual(params);
        }
    }

    const widget = new StubWidget(new WidgetDeps(bus, app, {endpoint: 'different-endpoint'}));
    widget.connect();

    bus.send(new RequestReceived(request));

    expect.assertions(0);
});
