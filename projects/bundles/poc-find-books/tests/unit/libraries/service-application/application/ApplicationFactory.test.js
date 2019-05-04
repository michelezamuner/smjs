const ApplicationFactory = require('../../../../../src/libraries/service-application/application/ApplicationFactory');
const WidgetBuilder = require('../../../../../src/libraries/service-application/application/WidgetBuilder');
const InputParser = require('../../../../../src/libraries/service-application/input-parser/InputParser');
const Application = require('../../../../../src/libraries/service-application/application/Application');
const MessageBus = require('message-bus').MessageBus;
const UI = require('../../../../../src/libraries/service-application/application/UI');

test('can be injected', () => {
    expect(ApplicationFactory.__DEPS__).toStrictEqual([ WidgetBuilder, InputParser ]);
});

test('provides fqcn', () => {
    expect(ApplicationFactory.toString()).toBe('FindBooks.ServiceApplication.Application.ApplicationFactory');
});

test('creates application and widgets', () => {
    const builder = {
        setMessageBus: jest.fn(),
        setUI: jest.fn(),
        build: jest.fn()
    };
    const parser = {};
    const widgets = [
        {name: 'name1', type: 'type1', args: 'args1'},
        {name: 'name2', type: 'type2', args: 'args2'},
    ];
    const factory = new ApplicationFactory(builder, parser);

    const app = factory.create(widgets);

    expect(app).toBeInstanceOf(Application);
    expect(builder.setMessageBus.mock.calls[0][0]).toBeInstanceOf(MessageBus);
    expect(builder.setUI.mock.calls[0][0]).toBeInstanceOf(UI);
    expect(builder.build.mock.calls[0][0]).toBe('name1');
    expect(builder.build.mock.calls[0][1]).toBe('type1');
    expect(builder.build.mock.calls[0][2]).toBe('args1');
    expect(builder.build.mock.calls[1][0]).toBe('name2');
    expect(builder.build.mock.calls[1][1]).toBe('type2');
    expect(builder.build.mock.calls[1][2]).toBe('args2');
});
