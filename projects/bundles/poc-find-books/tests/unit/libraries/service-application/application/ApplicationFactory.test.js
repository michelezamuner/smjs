const ApplicationFactory = require('../../../../../src/libraries/service-application/application/ApplicationFactory');
const WidgetFactory = require('../../../../../src/libraries/service-application/application/WidgetFactory');
const InputParser = require('../../../../../src/libraries/service-application/input-parser/InputParser');
const Application = require('../../../../../src/libraries/service-application/application/Application');
const MessageBus = require('message-bus').MessageBus;

test('can be injected', () => {
    expect(ApplicationFactory.__DEPS__).toStrictEqual([ WidgetFactory, InputParser ]);
});

test('provides fqcn', () => {
    expect(ApplicationFactory.toString()).toBe('FindBooks.ServiceApplication.Application.ApplicationFactory');
    expect(WidgetFactory.toString()).toBe('FindBooks.ServiceApplication.Application.WidgetFactory');
});

test('creates application and widgets with the same message bus', () => {
    let sharedBus = null;
    const widgetFactory = {
        create: jest.fn((type, bus, args) => {
            if (sharedBus === null) {
                sharedBus = bus;
            }
        })
    };
    const parser = {};
    const widgets = [
        {name: 'name1', type: 'type1', args: 'args1'},
        {name: 'name2', type: 'type2', args: 'args2'},
    ];
    const factory = new ApplicationFactory(widgetFactory, parser);

    const app = factory.create(widgets);

    expect(app).toBeInstanceOf(Application);
    expect(widgetFactory.create.mock.calls[0][0]).toBe('type1');
    expect(widgetFactory.create.mock.calls[0][1]).toBeInstanceOf(MessageBus);
    expect(widgetFactory.create.mock.calls[0][1]).toBe(sharedBus);
    expect(widgetFactory.create.mock.calls[0][2]).toBe('args1');
    expect(widgetFactory.create.mock.calls[1][0]).toBe('type2');
    expect(widgetFactory.create.mock.calls[1][1]).toBeInstanceOf(MessageBus);
    expect(widgetFactory.create.mock.calls[1][1]).toBe(sharedBus);
    expect(widgetFactory.create.mock.calls[1][2]).toBe('args2');
});
