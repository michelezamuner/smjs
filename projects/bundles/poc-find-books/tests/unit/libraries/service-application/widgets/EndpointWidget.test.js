const EndpointWidget = require('../../../../../src/libraries/service-application/widgets/EndpointWidget');
const Widget = require('../../../../../src/libraries/service-application/application/Widget');
const MessageBus = require('message-bus').MessageBus;
const UI = require('../../../../../src/libraries/service-application/application/UI');
const RequestReceived = require('../../../../../src/libraries/service-application/messages/RequestReceived');
const SendResponse = require('../../../../../src/libraries/service-application/messages/SendResponse');
const ServiceRequest = require('../../../../../src/libraries/service-application/input-parser/ServiceRequest');

/**
 * @type {Object|MessageBus}
 */
const bus = {};

/**
 * @type {Object|UI}
 */
const ui = {};

/**
 * @type {string}
 */
const endpoint = 'endpoint';

/**
 * @type {null|EndpointWidget}
 */
let widget = null;

/**
 * @type {Object}
 */
const params = {};

const request = new ServiceRequest(endpoint, params);

beforeEach(() => {
    bus.register = (types, callback) => {
        if (types[0] !== RequestReceived) return;
        bus.callback = callback;
    };
    bus.send = jest.fn(event => event instanceof RequestReceived ? bus.callback(event) : null);

    widget = new EndpointWidget(bus, ui, endpoint);
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

test('calls receive method on input', () => {
    class StubWidget extends EndpointWidget {
        receive(arg) {
            expect(arg).toStrictEqual(params);
        }
    }

    const widget = new StubWidget(bus, ui, endpoint);
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

    const widget = new StubWidget(bus, ui, 'different-endpoint');
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

test('has access to other widgets', () => {
    ui.getWidget = () => 'widget';

    class StubWidget extends EndpointWidget {
        receive(arg) {
            expect(this._ui.getWidget()).toBe('widget');
        }
    }

    const widget = new StubWidget(bus, ui, endpoint);
    widget.connect();

    bus.send(new RequestReceived(request));

    expect.assertions(1);
});
