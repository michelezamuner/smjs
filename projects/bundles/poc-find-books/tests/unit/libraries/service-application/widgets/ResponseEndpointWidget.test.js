const ResponseEndpointWidget = require('../../../../../src/libraries/service-application/widgets/ResponseEndpointWidget');
const EndpointWidget = require('../../../../../src/libraries/service-application/widgets/EndpointWidget');
const MessageBus = require('message-bus').MessageBus;
const SendResponse = require('../../../../../src/libraries/service-application/messages/SendResponse');

/**
 * @type {Object|MessageBus}
 */
const bus = {};

/**
 * @type {null|ResponseEndpointWidget}
 */
let widget = null;

beforeEach(() => {
    bus.send = jest.fn();
    widget = new ResponseEndpointWidget(bus, {});
});

test('extends endpoint widget', () => {
    expect(widget).toBeInstanceOf(EndpointWidget);
});

test('provides fqcn', () => {
    expect(ResponseEndpointWidget.toString()).toBe('FindBooks.ServiceApplication.Widgets.ResponseEndpointWidget');
});

test('sends responses', () => {
    const response = 'response';
    const command = new SendResponse(response);

    widget.respond(response);

    expect(bus.send.mock.calls[0][0]).toStrictEqual(command);
});
