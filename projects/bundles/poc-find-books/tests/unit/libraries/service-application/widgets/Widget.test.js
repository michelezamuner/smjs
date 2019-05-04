const Widget = require('../../../../../src/libraries/service-application/widgets/Widget');

test('provides fqcn', () => {
    expect(Widget.toString()).toBe('FindBooks.ServiceApplication.Widgets.Widget');
});

test('must override connect', () => {
    const widget = new Widget();
    expect(() => widget.connect()).toThrow('Not implemented');
});
