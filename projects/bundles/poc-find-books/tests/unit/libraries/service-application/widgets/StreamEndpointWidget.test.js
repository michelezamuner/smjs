const StreamEndpointWidget = require('../../../../../src/libraries/service-application/widgets/StreamEndpointWidget');
const EndpointWidget = require('../../../../../src/libraries/service-application/widgets/EndpointWidget');
const MessageBus = require('message-bus').MessageBus;
const WidgetDeps = require('../../../../../src/libraries/service-application/widgets/WidgetDeps');
const SendResponse = require('../../../../../src/libraries/service-application/messages/SendResponse');
const SendData = require('../../../../../src/libraries/service-application/messages/SendData');
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
 * @type {null|EndpointWidget}
 */
let widget = null;

beforeEach(() => {
    bus.send = jest.fn();
    factory.createAdapter = () => {};
    
    widget = new StreamEndpointWidget(deps);
});

test('extends endpoint widget', () => {
    expect(widget).toBeInstanceOf(EndpointWidget);
});

test('provides fqcn', () => {
    expect(StreamEndpointWidget.toString()).toBe('FindBooks.ServiceApplication.Widgets.StreamEndpointWidget');
});

test('sends data', () => {
    const data = ['data1', 'data2'];

    for (const i in data) {
        const item = data[i];
        const command = new SendData(item);

        widget.write(item);

        expect(bus.send.mock.calls[i][0]).toStrictEqual(command);
    }
});

test('closes connection', () => {
    const command = new SendResponse('');

    widget.close();

    expect(bus.send.mock.calls[0][0]).toStrictEqual(command);
});
