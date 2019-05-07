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

test('adds widget with app', () => {
    class StubWidget extends StandardWidget {
        /**
         * @param {WidgetDeps} deps
         */
        constructor(deps) {
            super(deps);
            this._params = deps.getParams();
        }

        /**
         * @return {MessageBus}
         */
        getBus() {
            return this._bus;
        }

        /**
         * @return {Application}
         */
        getApp() {
            return this._app;
        }

        /**
         * @return {Object}
         */
        getParams() {
            return this._params;
        }
    }
    const name = 'name';
    const params = {};

    const widget = new StandardWidget(deps);
    widget.addWidget(name, StubWidget, params);

    const child = widget.getWidget(name);
    expect(child).toBeInstanceOf(StandardWidget);
    expect(child.getBus()).toBe(bus);
    expect(child.getApp()).toBe(app);
    expect(child.getParams()).toBe(params);
});

test('provides default null adapter class', () => {
    expect(new StandardWidget(deps).getAdapterClass()).toBe(null);
});

test('provides own adapter', () => {
    const adapterClass = 'adapter class';
    class StubWidget extends StandardWidget {
        /**
         * @override
         */
        getAdapterClass() {
            return adapterClass;
        }
    }
    const adapter = {};

    app.getAdapter = arg => arg === adapterClass ? adapter : null;

    const widget = new StubWidget(deps);

    expect(widget.getAdapter()).toBe(adapter);
});
