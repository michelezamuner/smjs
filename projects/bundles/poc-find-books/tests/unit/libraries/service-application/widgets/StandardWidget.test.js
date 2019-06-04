const StandardWidget = require('../../../../../src/libraries/service-application/widgets/StandardWidget');
const Widget = require('../../../../../src/libraries/service-application/widgets/Widget');
const WidgetDeps = require('../../../../../src/libraries/service-application/widgets/WidgetDeps');
const WidgetAdapterFactory = require('../../../../../src/libraries/service-application/widgets/WidgetAdapterFactory');
const WidgetAdapter = require('../../../../../src/libraries/service-application/widgets/WidgetAdapter');
const MessageBus = require('message-bus').MessageBus;

/**
 * @type {Object|MessageBus}
 */
const bus = {};

/**
 * @type {Object|WidgetAdapterFactory}
 */
const factory = {};

/**
 * @type {Object}
 */
const params = {};

/**
 * @type {WidgetDeps}
 */
const deps = new WidgetDeps(bus, factory, params);

/**
 * @type {Object}
 */
const adapter = {};

/**
 * @type {Object}
 */
const adapterClass = {};

beforeEach(() => {
    adapter.widget = null;
    factory.createAdapter = jest.fn((classArg, widgetArg) => {
        if (classArg !== adapterClass) {
            return null;
        }
        adapter.widget = widgetArg;
        return adapter;
    });
});

test('extends widget', () => {
    expect(new StandardWidget(deps)).toBeInstanceOf(Widget);
});

test('provides fqcn', () => {
    expect(StandardWidget.toString()).toBe('FindBooks.ServiceApplication.Widgets.StandardWidget');
    expect(WidgetDeps.toString()).toBe('FindBooks.ServiceApplication.Widgets.WidgetDeps');
    expect(WidgetAdapter.toString()).toBe('FindBooks.ServiceApplication.Widgets.WidgetAdapter');
});

test('provides bus and factory', () => {
    class StubWidget extends StandardWidget {
        constructor(deps) {
            super(deps);
            expect(this._bus).toBe(bus);
            expect(this._factory).toBe(factory);
            expect(deps.getParams()).toBe(params);
        }
    }

    new StubWidget(deps);

    expect.assertions(3);
});

test('adds widget with factory', () => {
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
         * @return {WidgetAdapterFactory}
         */
        getFactory() {
            return this._factory;
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
    expect(child.getFactory()).toBe(factory);
    expect(child.getParams()).toBe(params);
});

test('provides default null adapter class', () => {
    expect(new StandardWidget(deps).getAdapterClass()).toBe(null);
});

test('provides own adapter cached', () => {
    class StubWidget extends StandardWidget {
        /**
         * @override
         */
        getAdapterClass() {
            return adapterClass;
        }
    }
    const widget = new StubWidget(deps);

    expect(widget.getAdapter()).toBe(adapter);
    expect(widget.getAdapter()).toBe(adapter);
    expect(widget.getAdapter().widget).toBe(widget);
    expect(factory.createAdapter).toBeCalledTimes(1);
});
