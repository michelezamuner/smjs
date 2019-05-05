const EndpointWidget = require('../../../../../src/libraries/service-application/widgets/EndpointWidget');
const Widget = require('../../../../../src/libraries/service-application/widgets/Widget');
const MessageBus = require('message-bus').MessageBus;
const Application = require('../../../../../src/libraries/service-application/application/Application');
const RequestReceived = require('../../../../../src/libraries/service-application/messages/RequestReceived');
const SendResponse = require('../../../../../src/libraries/service-application/messages/SendResponse');
const ServiceRequest = require('../../../../../src/libraries/service-application/input-parser/ServiceRequest');
const WidgetDeps = require('../../../../../src/libraries/service-application/widgets/WidgetDeps');

/**
 * @type {Object|MessageBus}
 */
const bus = {};

/**
 * @type {Object|Application}
 */
const app = {};

/**
 * @type {string}
 */
const endpoint = 'endpoint';

/**
 * @type {WidgetDeps}
 */
const deps = new WidgetDeps(bus, app, {endpoint: endpoint});

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

test('extends widget', () => {
    expect(widget).toBeInstanceOf(Widget);
});

test('provides fqcn', () => {
    expect(EndpointWidget.toString()).toBe('FindBooks.ServiceApplication.Widgets.EndpointWidget');
});

test('must implement receive method', () => {
    expect(() => widget.receive({})).toThrow('Not implemented');
});

test('calls parent connect', () => {
    const child = { connect: jest.fn() };

    widget.addWidget(child);
    widget.connect();

    expect(child.connect).toBeCalled();
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

test('sends responses', () => {
    const response = 'response';
    const command = new SendResponse(response);

    widget.respond(response);

    expect(bus.send.mock.calls[0][0]).toStrictEqual(command);
});
