const ApplicationWidgetFactory = require('../../../../../src/libraries/service-application/application/ApplicationWidgetFactory');
const WidgetBuilder = require('../../../../../src/libraries/service-application/application/WidgetBuilder');
const InputParser = require('../../../../../src/libraries/service-application/input-parser/InputParser');
const Application = require('../../../../../src/libraries/service-application/application/Application');
const MessageBus = require('message-bus').MessageBus;

test('can be injected', () => {
    expect(ApplicationWidgetFactory.__DEPS__).toStrictEqual([ WidgetBuilder, InputParser ]);
});

test('provides fqcn', () => {
    expect(ApplicationWidgetFactory.toString()).toBe('FindBooks.ServiceApplication.Application.ApplicationWidgetFactory');
});

test('creates application and widgets', () => {
    class StubApplication extends Application {}
    const builder = {
        setMessageBus: jest.fn(),
        build: jest.fn()
    };
    const parser = {};
    const connection = {};
    const widgets = [
        {name: 'name1', type: 'type1', params: 'args1'},
        {name: 'name2', type: 'type2', params: 'args2'},
    ];
    const factory = new ApplicationWidgetFactory(builder, parser);

    const app = factory.create(StubApplication, widgets, connection);

    expect(app).toBeInstanceOf(StubApplication);
    expect(builder.setMessageBus.mock.calls[0][0]).toBeInstanceOf(MessageBus);
    expect(builder.build.mock.calls[0][0]).toBe('type1');
    expect(builder.build.mock.calls[0][1]).toBe('args1');
    expect(builder.build.mock.calls[1][0]).toBe('type2');
    expect(builder.build.mock.calls[1][1]).toBe('args2');
});
