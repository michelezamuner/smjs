const Widget = require('../../../../../src/libraries/service-application/widgets/Widget');
const WidgetDeps = require('../../../../../src/libraries/service-application/widgets/WidgetDeps');

const bus = {};
const app = {};
const params = {};
const deps = new WidgetDeps(bus, app, params);

test('provides fqcn', () => {
    expect(Widget.toString()).toBe('FindBooks.ServiceApplication.Widgets.Widget');
    expect(WidgetDeps.toString()).toBe('FindBooks.ServiceApplication.Widgets.WidgetDeps');
});

test('provides bus and app', () => {
    class StubWidget extends Widget {
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

test('connects children widgets', () => {
    const widget = new Widget(deps);
    const children = [
        { connect: jest.fn() },
        { connect: jest.fn() },
    ];

    children.forEach(child => widget.addWidget(child));

    widget.connect();

    children.forEach(child => expect(child.connect).toBeCalled());
});
