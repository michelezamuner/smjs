const ResponseEndpointWidget = require('../../../../../src/libraries/service-application/widgets/ResponseEndpointWidget');
const EndpointWidget = require('../../../../../src/libraries/service-application/widgets/EndpointWidget');
const MessageBus = require('message-bus').MessageBus;
const WidgetDeps = require('../../../../../src/libraries/service-application/widgets/WidgetDeps');
const SendResponse = require('../../../../../src/libraries/service-application/messages/SendResponse');
const WidgetAdapterFactory = require('../../../../../src/libraries/service-application/widgets/WidgetAdapterFactory');

/**
 * @type {Object|MessageBus}
 */
const bus = {};

/**
 * @type {Object|WidgetAdapterFactory}
 */
const factory = {};

/**
 * @type {WidgetDeps}
 */
const deps = new WidgetDeps(bus, factory, {});

/**
 * @type {null|ResponseEndpointWidget}
 */
let widget = null;

beforeEach(() => {
    bus.send = jest.fn();
    factory.createAdapter = () => {};
    
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
