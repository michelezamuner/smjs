const StandardWidget = require('../../../../../src/libraries/service-application/widgets/StandardWidget');
const Widget = require('../../../../../src/libraries/service-application/widgets/Widget');
const WidgetDeps = require('../../../../../src/libraries/service-application/widgets/WidgetDeps');

const bus = {};
const app = {};
const params = {};
const deps = new WidgetDeps(bus, app, params);

test('extends widget', () => {
    expect(new StandardWidget(deps)).toBeInstanceOf(Widget);
});

test('provides fqcn', () => {
    expect(StandardWidget.toString()).toBe('FindBooks.ServiceApplication.Widgets.StandardWidget');
    expect(WidgetDeps.toString()).toBe('FindBooks.ServiceApplication.Widgets.WidgetDeps');
});

test('provides bus and app', () => {
    class StubWidget extends StandardWidget {
        constructor(deps) {
            super(deps);
            expect(this._bus).toBe(bus);
            expect(this._app).toBe(app);
            expect(deps.getParams()).toBe(params);
        }
    }

    new StubWidget(deps);

    expect.assertions(3);
});
