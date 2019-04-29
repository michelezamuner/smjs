const ApplicationFactory = require('../../../../../src/libraries/service-application/application/ApplicationFactory');
const MessageBusFactory = require('../../../../../src/libraries/service-application/application/MessageBusFactory');
const WidgetFactory = require('../../../../../src/libraries/service-application/application/WidgetFactory');
const InputParser = require('../../../../../src/libraries/service-application/input-parser/InputParser');
const Application = require('../../../../../src/libraries/service-application/application/Application');

test('can be injected', () => {
    expect(ApplicationFactory.__DEPS__).toStrictEqual([MessageBusFactory, WidgetFactory, InputParser]);
});

test('provides fqcn', () => {
    expect(ApplicationFactory.toString()).toBe('FindBooks.ServiceApplication.Application.ApplicationFactory');
});

test('creates application', () => {
    const busFactory = {create: () => {}};
    const widgetFactory = {};
    const parser = {};
    const factory = new ApplicationFactory(busFactory, widgetFactory, parser);

    expect(factory.create()).toBeInstanceOf(Application);
});
