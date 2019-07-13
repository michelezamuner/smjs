const EndpointWidget = require('../../../../../src/libraries/service-application/widgets/EndpointWidget');
const Widget = require('../../../../../src/libraries/service-application/widgets/Widget');
const MessageBus = require('message-bus').MessageBus;
const RequestReceived = require('../../../../../src/libraries/service-application/messages/RequestReceived');

/**
 * @type {Object|MessageBus}
 */
const bus = {};

/**
 * @type {null|EndpointWidget}
 */
let widget = null;

/**
 * @type {string}
 */
const endpoint = 'endpoint';

beforeEach(() => {
    bus.register = (types, callback) => bus.callback = callback;
    bus.send = msg => msg instanceof RequestReceived ? bus.callback(msg) : null;
    widget = new EndpointWidget(bus, { endpoint: endpoint });
});

test('extends widget', () => {
    expect(widget).toBeInstanceOf(Widget);
});

test('provides fqcn', () => {
    expect(EndpointWidget.toString()).toBe('FindBooks.ServiceApplication.Widgets.EndpointWidget');
});

test('must implement receive method', () => {
    expect(() => widget.receive()).toThrow('Not implemented');
});

test('calls parent connect', () => {
    widget.addWidget('widget', { connect: jest.fn() });
    widget.connect();

    expect(widget.getWidget('widget').connect).toHaveBeenCalled();
});

test('calls receive method on input', () => {
    const request = { getEndpoint: () => endpoint };
    widget.receive = arg => expect(arg).toBe(request);

    widget.connect();
    bus.send(new RequestReceived(request));

    expect.assertions(1);
});

test('ignores events with different endpoints', () => {
    const request = { getEndpoint: () => 'other-endpoint' };
    widget.receive = jest.fn();

    widget.connect();

    bus.send(new RequestReceived(request));

    expect(widget.receive).not.toHaveBeenCalled();
});