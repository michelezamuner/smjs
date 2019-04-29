const EndpointWidget = require('../../../../../src/libraries/service-application/widgets/EndpointWidget');
const MessageBus = require('message-bus').MessageBus;
const RequestReceived = require('../../../../../src/libraries/service-application/messages/RequestReceived');
const SendResponse = require('../../../../../src/libraries/service-application/messages/SendResponse');
const ServiceRequest = require('../../../../../src/libraries/service-application/input-parser/ServiceRequest');

/**
 * @type {Object|MessageBus}
 */
const bus = {};

/**
 * @type {string}
 */
const endpoint = 'endpoint';

beforeEach(() => {
    bus.register = (types, callback) => {
        if (types[0] !== RequestReceived) {
            return;
        }
        bus.callback = callback;
    };
    bus.send = jest.fn(event => event instanceof RequestReceived ? bus.callback(event) : null);
});

test('provides fqcn', () => {
    expect(EndpointWidget.toString()).toBe('FindBooks.ServiceApplication.Widgets.EndpointWidget');
});

test('must implement receive method', () => {
    const widget = new EndpointWidget(bus, 'name');
    expect(() => widget.receive({})).toThrow('Not implemented');
});

test('calls receive method on input', () => {
    const params = {};
    const request = new ServiceRequest(endpoint, params);

    class Widget extends EndpointWidget {
        receive(arg) {
            expect(arg).toStrictEqual(params);
        }
    }

    new Widget(bus, endpoint);

    bus.send(new RequestReceived(request));

    expect.assertions(1);
});

test('ignores events with different endpoints', () => {
    const request = new ServiceRequest(endpoint, {});

    class Widget extends EndpointWidget {
        receive(arg) {
            expect(arg).toBeDefined();
        }
    }

    new Widget(bus, 'different-endpoint');

    bus.send(new RequestReceived(request));

    expect.assertions(0);
});

test('sends responses', () => {
    const response = 'response';
    const command = new SendResponse(response);

    class Widget extends EndpointWidget {}

    const widget = new Widget(bus, '');

    widget.respond(response);

    expect(bus.send.mock.calls[0][0]).toStrictEqual(command);
});
