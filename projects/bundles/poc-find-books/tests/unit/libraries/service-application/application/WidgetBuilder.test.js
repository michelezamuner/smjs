const WidgetBuilder = require('../../../../../src/libraries/service-application/application/WidgetBuilder');
const ServiceApplicationException = require('../../../../../src/libraries/service-application/ServiceApplicationException');
const Widget = require('../../../../../src/libraries/service-application/widgets/Widget');

test('provides fqcn', () => {
    expect(WidgetBuilder.toString()).toBe('FindBooks.ServiceApplication.Application.WidgetBuilder');
});

test('register widgets into UI', () => {
    const bus = {};
    const ui = { addWidget: jest.fn() };
    const name = 'name';
    const args = ['args'];
    class StubWidget extends Widget {
        constructor(busArg, uiArg, argsArg) {
            super(busArg, uiArg);
            expect(busArg).toBe(bus);
            expect(uiArg).toBe(ui);
            expect(argsArg).toBe(args[0]);
        }
    }

    const builder = new WidgetBuilder();
    builder.setMessageBus(bus);
    builder.setUI(ui);
    const widget = builder.build(name, StubWidget, args);

    expect(widget).toBeInstanceOf(StubWidget);
    expect(ui.addWidget.mock.calls[0][0]).toBe(name);
    expect(ui.addWidget.mock.calls[0][1]).toBe(widget);

    expect.assertions(6);
});

test('fails if building widgets with no bus set', () => {
    class StubWidget {}

    const builder = new WidgetBuilder();
    builder.setUI({});

    (expect(() => builder.build('name', StubWidget))).toThrow(ServiceApplicationException);
    (expect(() => builder.build('name', StubWidget))).toThrow('Cannot build widgets with no message bus set');
});

test('fails if building widgets with no bus set', () => {
    class StubWidget {}

    const builder = new WidgetBuilder();
    builder.setMessageBus({});

    (expect(() => builder.build('name', StubWidget))).toThrow(ServiceApplicationException);
    (expect(() => builder.build('name', StubWidget))).toThrow('Cannot build widgets with no UI set');
});

test('fails if building non widgets', () => {
    class StubWidget {}

    const builder = new WidgetBuilder();
    builder.setMessageBus({});
    builder.setUI({});

    expect(() => builder.build('name', StubWidget)).toThrow(ServiceApplicationException);
    expect(() => builder.build('name', StubWidget)).toThrow(`${StubWidget} does not extend Widget`);
});
