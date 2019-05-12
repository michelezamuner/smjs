const ResponseEndpointWidget = require('../../../../../src/libraries/service-application/widgets/ResponseEndpointWidget');
const EndpointWidget = require('../../../../../src/libraries/service-application/widgets/EndpointWidget');
const MessageBus = require('message-bus').MessageBus;
const ApplicationWidget = require('../../../../../src/libraries/service-application/widgets/ApplicationWidget');
const WidgetDeps = require('../../../../../src/libraries/service-application/widgets/WidgetDeps');
const SendResponse = require('../../../../../src/libraries/service-application/messages/SendResponse');

/**
 * @type {Object|MessageBus}
 */
const bus = {};

/**
 * @type {Object|ApplicationWidget}
 */
const app = {};

/**
 * @type {WidgetDeps}
 */
const deps = new WidgetDeps(bus, app, {});

/**
 * @type {null|ResponseEndpointWidget}
 */
let widget = null;

beforeEach(() => {
    bus.send = jest.fn();
    widget = new ResponseEndpointWidget(deps);
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
