const WidgetAdapters = require('../../../../../src/libraries/service-application/widgets/WidgetAdapters');

test('provides fqcn', () => {
    expect(WidgetAdapters.toString()).toBe('FindBooks.ServiceApplication.Widgets.WidgetAdapters');
});

test('must implement createAdapter', () => {
    expect(() => new WidgetAdapters().getAdapter('widgetClass')).toThrow('Not implemented');
});

test('creates adapters only once for type', () => {
    const adaptersObjects = {a1: {}, a2: {}};
    class StubWidgetAdapters extends WidgetAdapters {
        /**
         * @override
         */
        _createAdapter(widgetClass) {
            return adaptersObjects[widgetClass];
        }
    }

    const adapters = new StubWidgetAdapters();

    expect(adapters.getAdapter('a1')).toBe(adaptersObjects.a1);
    expect(adapters.getAdapter('a1')).toBe(adaptersObjects.a1);
    expect(adapters.getAdapter('a2')).toBe(adaptersObjects.a2);
});
