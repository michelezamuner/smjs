const ApplicationWidgetFactory = require('../../../../../src/libraries/service-application/application/ApplicationWidgetFactory');
const InputParser = require('../../../../../src/libraries/service-application/input-parser/InputParser');
const Application = require('../../../../../src/libraries/service-application/application/Application');
const StandardWidget = require('../../../../../src/libraries/service-application/widgets/StandardWidget');

test('can be injected', () => {
    expect(ApplicationWidgetFactory.__DEPS__).toStrictEqual([ InputParser ]);
});

test('provides fqcn', () => {
    expect(ApplicationWidgetFactory.toString()).toBe('FindBooks.ServiceApplication.Application.ApplicationWidgetFactory');
});

test('creates application and widgets', () => {
    class StubApplication extends Application {}
    const parser = {};
    const connection = {};
    const widgets = [
        {name: 'name1', type: StandardWidget, params: 'args1'},
        {name: 'name2', type: StandardWidget, params: 'args2'},
    ];
    const factory = new ApplicationWidgetFactory(parser);

    const app = factory.create(StubApplication, widgets, connection);

    expect(app).toBeInstanceOf(StubApplication);
    for (const widget of widgets) {
        expect(app.getWidget(widget.name)).toBeInstanceOf(widget.type);
    }
});
