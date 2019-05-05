const WidgetBuilder = require('../../../../../src/libraries/service-application/application/WidgetBuilder');
const ServiceApplicationException = require('../../../../../src/libraries/service-application/ServiceApplicationException');
const Widget = require('../../../../../src/libraries/service-application/widgets/Widget');
const MessageBus = require('message-bus').MessageBus;

/**
 * @type {Object|MessageBus}
 */
const bus = {};

/**
 * @type {null|WidgetBuilder}
 */
let builder = null;

beforeEach(() => {
    builder = new WidgetBuilder;
    builder.setMessageBus(bus);
});

test('provides fqcn', () => {
    expect(WidgetBuilder.toString()).toBe('FindBooks.ServiceApplication.Application.WidgetBuilder');
});

test('builds widget of the given type', () => {
    class StubWidget extends Widget {}

    const widget = builder.build(StubWidget);

    expect(widget).toBeInstanceOf(StubWidget);
});

test('fails if building widgets with no bus set', () => {
    class StubWidget {}

    builder.setMessageBus(null);

    (expect(() => builder.build(StubWidget))).toThrow(ServiceApplicationException);
    (expect(() => builder.build(StubWidget))).toThrow('Cannot build widgets with no message bus set');
});

test('fails if building non widgets', () => {
    class StubWidget {}

    expect(() => builder.build(StubWidget)).toThrow(ServiceApplicationException);
    expect(() => builder.build(StubWidget)).toThrow(`${StubWidget} does not extend Widget`);
});
